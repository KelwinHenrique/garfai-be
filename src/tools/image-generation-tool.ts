import { Tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolOutput } from "../types/tool.type";
import { GoogleGenAI, Modality } from "@google/genai";
import { StorageService } from "../services/storage-service";


const ImageGenerationInputSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  style: z.enum(['elegant', 'rustic', 'modern', 'artistic']).default('modern'),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('hd')
});

type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

export class ImageGenerationTool extends Tool {
  name = "image_generator";
  description = "Generates professional food photography images based on input image. You will receive the analysis with enhancement suggestions by image_analyzer tool and the original image.";
  
  private genai: GoogleGenAI;
  private imageUrl?: string;
  private storageService: StorageService;
  
  constructor(imageUrl?: string) {
    super();
    this.genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    this.imageUrl = imageUrl;
    this.storageService = new StorageService();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = this.parseInput(input);
      const result = await this.generateImage(parsedInput);
      return JSON.stringify(result);
    } catch (error) {
      console.error("Image generation error:", error);
      const errorResult: ToolOutput = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      };
      return JSON.stringify(errorResult);
    }
  }

  private parseInput(input: string): ImageGenerationInput {
    try {
      const parsed = JSON.parse(input);
      return ImageGenerationInputSchema.parse(parsed);
    } catch {
      return ImageGenerationInputSchema.parse({ description: input });
    }
  }

  private async getImageFileFromUrl(url: string): Promise<{ base64: string; dataUri: string }> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const mimeType = response.headers.get('content-type');
      const dataUri = `data:${mimeType};base64,${base64}`;
      
      return { base64, dataUri };
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  }

  private async generateImage(input: ImageGenerationInput): Promise<string> {
    const { description, style } = input;
    
    const stylePrompts = {
      elegant: "sophisticated, fine dining, minimalist plating, soft lighting",
      rustic: "homestyle, natural textures, warm lighting, casual presentation",
      modern: "contemporary, geometric plating, clean lines, dramatic lighting",
      artistic: "creative presentation, unique angles, artistic composition, bold colors"
    };

    const enhancedPrompt = this.buildEnhancedPrompt(description, stylePrompts[style]);
    const image = await this.getImageFileFromUrl(this.imageUrl!);
    const response = await this.genai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [
        { text: enhancedPrompt },
        {
          inlineData: {
            mimeType: "image/png",
            data: image.base64,
          },
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        temperature: 0.3,
      },
    })
    let imageUrl = "";
    imageUrl = await this.extractImageFromResult(response);
    return imageUrl || "";
  }

  private async extractImageFromResult(result: any): Promise<string> {
    for (const part of result?.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData?.data || "", "base64");
        
        try {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `food-image-${timestamp}.png`;

          return await this.storageService.uploadBuffer(buffer, filename);
        } catch (error) {
          console.error("Error uploading image to Backblaze:", error);
          throw error;
        }
      }
    }
    return "";
  }

  private buildEnhancedPrompt(description: string, styleElements: string): string {
    return `Create a professional, photorealistic, and highly appetizing image based image input and description improvements. 

    Style requirements: ${styleElements}
    
    Technical specifications:
    - High-end food photography for restaurant promotional material
    - Perfect studio lighting with soft shadows
    - Elegant plating on premium dinnerware
    - Vibrant, saturated colors that enhance appetite appeal
    - Sharp focus on the main dish with subtle background blur
    - Professional composition following rule of thirds
    - Clean, modern presentation
    - Restaurant-quality garnishing and styling
    
    The final image should feel vibrant, professional, and irresistibly tasty, making the viewer want to order the dish immediately.
    YOU CANT CHANGE THE CORE INGREDIENTS OF THE DISH ITSELF OR THE DISH ITSELF`;
  }
}