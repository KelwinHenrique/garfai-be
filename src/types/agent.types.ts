import { ImageAnalysisResult, ImageGenerationResult } from "./tool.type";

export interface AgentConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxIterations?: number;
  verbose?: boolean;
}

export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  executionTime?: number;
}

export interface ImageProcessingResult {
  originalImageUrl: string;
  analysis: ImageAnalysisResult;
  generatedImage: ImageGenerationResult;
  agentResponse: string;
  steps: AgentStep[];
}

export interface AgentStep {
  tool: string;
  input: any;
  output: any;
  timestamp: string;
}
