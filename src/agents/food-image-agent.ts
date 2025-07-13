import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ImageAnalysisTool } from "../tools/image-analysis-tool";
import { ImageGenerationTool } from "../tools/image-generation-tool";
import { 
  AgentConfig, 
  AgentResponse, 
  ImageProcessingResult,
} from "../types/agent.types";
import { db } from "../config/database";
import { imageProcessingJobs, EJobStatus } from "../schemas/imageProcessingJobs.schema";
import { eq } from "drizzle-orm";

export class FoodImageAgent {
  private llm: ChatGoogleGenerativeAI;
  private tools: (ImageAnalysisTool | ImageGenerationTool)[];
  private agent: any;
  private agentExecutor: AgentExecutor | null = null;
  private config: AgentConfig;

  constructor(config: AgentConfig, imageUrl?: string) {
    this.config = {
      model: "gemini-2.5-pro",
      temperature: 0.7,
      maxIterations: 5,
      verbose: false,
      ...config
    };

    this.llm = new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: this.config.model!,
      temperature: this.config.temperature!
    });
    
    this.tools = [
      new ImageAnalysisTool(),
      new ImageGenerationTool(imageUrl)
    ];
  }

  async initialize(): Promise<void> {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", this.getSystemPrompt()],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"]
    ]);

    this.agent = createToolCallingAgent({
      llm: this.llm,
      tools: this.tools,
      prompt
    });

    this.agentExecutor = new AgentExecutor({
      agent: this.agent,
      tools: this.tools,
      verbose: this.config.verbose!,
      maxIterations: this.config.maxIterations!
    });
  }

  /**
   * Process an image asynchronously
   * 
   * This method creates a job entry in the database and immediately returns
   * while processing continues in the background
   * 
   * @param imageUrl - URL of the image to process
   * @param itemId - ID of the item associated with this image
   * @param options - Processing options
   * @returns Promise with job ID and initial status
   */
  async processImage(
    imageUrl: string,
    itemId: string,
    options = {}
  ): Promise<AgentResponse<{ jobId: string }>> {
    const startTime = Date.now();
    
    try {
      // Create a job entry in the database
      const [job] = await db.insert(imageProcessingJobs).values({
        itemId,
        imageUrl,
        status: EJobStatus.PROCESSING,
        startedAt: new Date(),
      }).returning({ id: imageProcessingJobs.id });

      // Start processing in the background
      this.processImageInBackground(job.id, imageUrl, options).catch(error => {
        console.error(`Background processing failed for job ${job.id}:`, error);
      });

      // Return immediately with the job ID
      return {
        success: true,
        data: { jobId: job.id },
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Process image in the background and update job status when complete
   * 
   * @param jobId - ID of the job in the database
   * @param imageUrl - URL of the image to process
   * @param options - Processing options
   */
  private async processImageInBackground(
    jobId: string,
    imageUrl: string,
    options = {}
  ): Promise<void> {
    try {
      if (!this.agentExecutor) {
        await this.initialize();
      }

      const input = this.buildImageProcessingPrompt(imageUrl, options);
      const result = await this.agentExecutor!.invoke({ input });
      
      // Extract enhanced image URL and analysis result from the agent result
      const enhancedImageUrl = this.extractEnhancedImageUrl(result);
      
      // Update job status to completed
      await db.update(imageProcessingJobs)
        .set({
          status: EJobStatus.COMPLETED,
          enhancedImageUrl,
          analysisResult: result,
          completedAt: new Date(),
        })
        .where(eq(imageProcessingJobs.id, jobId));
        
      console.log(`Job ${jobId} completed successfully`);
    } catch (error) {
      // Update job status to failed
      await db.update(imageProcessingJobs)
        .set({
          status: EJobStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          completedAt: new Date(),
        })
        .where(eq(imageProcessingJobs.id, jobId));
        
      console.error(`Job ${jobId} failed:`, error);
    }
  }
  
  /**
   * Extract enhanced image URL from agent result
   * 
   * @param result - Result from agent execution
   * @returns URL of the enhanced image or undefined if not found
   */
  private extractEnhancedImageUrl(result: any): string | undefined {
    try {
      // Extract URL from the result based on your agent's output structure
      // This is a placeholder - adjust based on your actual result structure
      if (result.output && typeof result.output === 'string') {
        // Try to find a URL in the output
        const urlMatch = result.output.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);
        if (urlMatch) {
          return urlMatch[0];
        }
      }
      
      // Check if there's a tool output with an image URL
      if (result.intermediateSteps && Array.isArray(result.intermediateSteps)) {
        for (const step of result.intermediateSteps) {
          if (step.observation && typeof step.observation === 'string') {
            const urlMatch = step.observation.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);
            if (urlMatch) {
              return urlMatch[0];
            }
          }
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Error extracting enhanced image URL:', error);
      return undefined;
    }
  }

  private getSystemPrompt(): string {
    return `You are a specialized AI agent for food photography enhancement. Your role is to:

    1. Analyze food images provided by users to understand the dish, ingredients, presentation, and style
    2. Generate enhanced professional food photography based on the analysis

    Available tools:
    - image_analyzer: Analyzes food images and provides detailed enhancement suggestions
    - image_generator: Creates professional food photography based on enhancement suggestions by image_analyzer tool and original image

    Process:
    - When given an image URL, first use the image_analyzer tool to get a detailed enhancement suggestions
    - Then use the image_generator tool with the enhancement suggestions to create a professional food photography version

    Always be thorough in your analysis and creative in your enhancement suggestions.`;
  }

  private buildImageProcessingPrompt(imageUrl: string, options: { analysisDepth?: string; generationStyle?: string }): string {
    const { analysisDepth = 'detailed', generationStyle = 'elegant' } = options;
    
    return `Please analyze this food image and create an enhanced professional version: ${imageUrl}

    Processing requirements:
    - Analysis depth: ${analysisDepth}
    - Generation style: ${generationStyle}

    Steps to follow:
    1. First, analyze the image using the image_analyzer tool with depth "${analysisDepth}"
    2. Then generate a new professional food photography version using the image_generator tool with style "${generationStyle} and analysis by image_analyzer tool"

    Image URL: ${imageUrl}`;
  }
}