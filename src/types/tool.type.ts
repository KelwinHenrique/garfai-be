export interface ImageAnalysisResult {
  analysis: string;
  originalImageUrl: string;
  timestamp: string;
  confidence?: number;
  detectedElements?: FoodElement[];
}

export interface ImageGenerationResult {
  generatedImageUrl: string;
  enhancedPrompt: string;
  revisedPrompt: string;
  timestamp: string;
  generationParams: GenerationParams;
}

export interface FoodElement {
  type: "main_dish" | "side" | "garnish" | "sauce" | "beverage";
  name: string;
  description: string;
  confidence: number;
}

export interface GenerationParams {
  model: string;
  size: string;
  quality: string;
  style: string;
}

export interface ToolInput {
  [key: string]: any;
}

export interface ToolOutput {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}
