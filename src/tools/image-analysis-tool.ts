import { Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import {
  ToolOutput,
} from "../types/tool.type";

const ImageAnalysisInputSchema = z.object({
  imageUrl: z.string().url("Invalid image URL format"),
  analysisDepth: z
    .enum(["basic", "detailed", "comprehensive"])
    .default("detailed"),
});

type ImageAnalysisInput = z.infer<typeof ImageAnalysisInputSchema>;

export class ImageAnalysisTool extends Tool {
  name = "image_analyzer";
  description =
    "Analyzes food images to extract detailed descriptions of dishes, ingredients, presentation, and visual characteristics. Returns structured analysis data.";

  private visionModel: ChatOpenAI;

  constructor() {
    super();
    this.visionModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: 'gpt-4o-2024-08-06',
      temperature: 0.3,
    });
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = this.parseInput(input);
      const result = await this.analyzeImage(parsedInput);
      return result;
    } catch (error) {
      const errorResult: ToolOutput = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
      return JSON.stringify(errorResult);
    }
  }

  private parseInput(input: string): ImageAnalysisInput {
    try {
      const parsed = JSON.parse(input);
      return ImageAnalysisInputSchema.parse(parsed);
    } catch {
      // Fallback: assume input is just a URL string
      return ImageAnalysisInputSchema.parse({ imageUrl: input });
    }
  }

  private async analyzeImage(
    input: ImageAnalysisInput
  ): Promise<string> {
    const { imageUrl } = input;

    const analysisPrompts =  `Act as a professional food stylist and creative director. Your task is to provide actionable recommendations to elevate this food image to a professional, magazine-quality standard. You must not suggest changing the core ingredients of the dish itself. Instead, focus your feedback on improvements in the following areas:
            Plating and Arrangement: How could the existing food elements be rearranged on the plate for better visual balance, focus, and dynamism? Suggest specific techniques (e.g., creating height, using the rule of odds, creating negative space).
            Styling and Props: What specific, subtle changes to props and the background would enhance the scene? Consider the surface, cutlery, napkins, and background elements that could better complement the dish and tell a story.
            Lighting Technique: Analyze the current lighting setup. Provide concrete advice on how to improve it. For example: "Soften the light by using a diffuser," "Add a bounce card on the left to fill in harsh shadows," or "Change the light's direction to a 45-degree back-light to emphasize texture."
            Camera Angle and Composition: Is the current camera angle and framing optimal? Suggest a more compelling alternative (e.g., a 45-degree angle, a top-down flat lay, a macro shot) and explain why it would be more effective for this specific dish.
            Enhancing Appetite Appeal: Suggest minor, non-intrusive additions that make the food look more appealing. Examples: a drizzle of fresh olive oil for shine, a sprinkle of microgreens for a pop of color, or a dash of fresh pepper to imply freshness.
            Post-Processing Suggestions: What specific, subtle edits in post-processing would you recommend? (e.g., "Increase contrast slightly to make textures pop," "Adjust white balance for a warmer, more inviting tone," "Apply selective sharpening to the main protein.")"`;

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: analysisPrompts,
        },
        {
          type: "image_url",
          image_url: { url: imageUrl },
        },
      ],
    });

    const response = await this.visionModel.invoke([message]);


    return response.content as string;
  }

 
}
