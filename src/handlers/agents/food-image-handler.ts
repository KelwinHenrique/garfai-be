/**
 * Food Image Agent Handler
 * 
 * Provides endpoints to process food images using the FoodImageAgent
 */
import { Request, Response } from 'express';
import { FoodImageAgent } from '../../agents/food-image-agent';
import * as yup from 'yup';
import { AI_CONFIG } from '../../config/app-config';

// Validation schema for the request
const processFoodImageSchema = yup.object({
  imageUrl: yup.string().url().required(),
  prompt: yup.string().optional(),
  analysisDepth: yup.string().oneOf(['basic', 'detailed', 'comprehensive']).optional(),
  generationStyle: yup.string().optional()
});

/**
 * Process a food image using the FoodImageAgent
 * 
 * @param req Express request object
 * @param res Express response object
 */
export const processFoodImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { imageUrl, prompt, analysisDepth = 'detailed', generationStyle = 'elegant' } = await processFoodImageSchema.validate(req.body);
    
    // Create agent config
    const agentConfig = {
      apiKey: AI_CONFIG.GOOGLE.API_KEY,
      verbose: true,
      maxIterations: 5
    };
    
    // Initialize the agent
    const foodImageAgent = new FoodImageAgent(agentConfig);
    
    // Process the image with optional parameters
    const options = {
      analysisDepth,
      generationStyle,
      customPrompt: prompt
    };
    
    const result = await foodImageAgent.processImage(imageUrl, options);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing food image:', error);
    
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
};
