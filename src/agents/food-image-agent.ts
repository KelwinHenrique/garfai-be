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

  async processImage(
    imageUrl: string, 
    options = {}
  ): Promise<AgentResponse<ImageProcessingResult>> {
    const startTime = Date.now();
    
    try {
      if (!this.agentExecutor) {
        await this.initialize();
      }

      const input = this.buildImageProcessingPrompt(imageUrl, options);
      const result = await this.agentExecutor!.invoke({ input });
      console.log(result);

      return {
        success: true,
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