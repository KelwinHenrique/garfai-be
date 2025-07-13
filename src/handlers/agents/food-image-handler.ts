/**
 * Food Image Agent Handler
 * 
 * Provides endpoints to process food images using the FoodImageAgent
 */
import { Request, Response } from 'express';
import { FoodImageAgent } from '../../agents/food-image-agent';
import * as yup from 'yup';
import { AI_CONFIG } from '../../config/app-config';
import { db } from '../../config/database';
import { imageProcessingJobs } from '../../schemas/imageProcessingJobs.schema';
import { eq, desc } from 'drizzle-orm';

// Validation schema for the request
const processFoodImageSchema = yup.object({
  imageUrl: yup.string().url().required(),
  itemId: yup.string().uuid().required(),
  prompt: yup.string().optional(),
  analysisDepth: yup.string().oneOf(['basic', 'detailed', 'comprehensive']).optional(),
  generationStyle: yup.string().optional()
});

// Validation schema for the job status request
const getJobStatusSchema = yup.object({
  jobId: yup.string().uuid().required()
});

// Validation schema for the item jobs request
const getItemJobsSchema = yup.object({
  itemId: yup.string().uuid().required()
});

/**
 * Process a food image using the FoodImageAgent asynchronously
 * 
 * Creates a job and returns immediately while processing continues in the background
 * 
 * @param req Express request object
 * @param res Express response object
 */
export const processFoodImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { 
      imageUrl, 
      itemId,
      prompt, 
      analysisDepth = 'detailed', 
      generationStyle = 'elegant' 
    } = await processFoodImageSchema.validate(req.body);
    
    // Create agent config
    const agentConfig = {
      apiKey: AI_CONFIG.GOOGLE.API_KEY,
      verbose: true,
      maxIterations: 5
    };
    
    // Initialize the agent
    const foodImageAgent = new FoodImageAgent(agentConfig, imageUrl);
    
    // Process the image with optional parameters (returns immediately)
    const options = {
      analysisDepth,
      generationStyle,
      customPrompt: prompt
    };
    
    const result = await foodImageAgent.processImage(imageUrl, itemId, options);
    
    res.status(202).json(result);
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

/**
 * Get the status of a food image processing job by job ID
 * 
 * @param req Express request object
 * @param res Express response object
 */
export const getJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request parameters
    const { jobId } = await getJobStatusSchema.validate(req.params);
    
    // Get job status from database
    const [job] = await db
      .select()
      .from(imageProcessingJobs)
      .where(eq(imageProcessingJobs.id, jobId))
      .limit(1);
    
    if (!job) {
      res.status(404).json({
        success: false,
        error: 'Job not found',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: job,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting job status:', error);
    
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

/**
 * Get all food image processing jobs for a specific item
 * 
 * @param req Express request object
 * @param res Express response object
 */
export const getItemJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request parameters
    const { itemId } = await getItemJobsSchema.validate(req.params);
    
    // Get all jobs for the item from database, ordered by creation date (newest first)
    const jobs = await db
      .select()
      .from(imageProcessingJobs)
      .where(eq(imageProcessingJobs.itemId, itemId))
      .orderBy(desc(imageProcessingJobs.createdAt));
    
    if (jobs.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No jobs found for this item',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: jobs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting item jobs:', error);
    
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

/**
 * Get the latest food image processing job for a specific item
 * 
 * @param req Express request object
 * @param res Express response object
 */
export const getLatestItemJob = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request parameters
    const { itemId } = await getItemJobsSchema.validate(req.params);
    
    // Get the latest job for the item from database
    const [job] = await db
      .select()
      .from(imageProcessingJobs)
      .where(eq(imageProcessingJobs.itemId, itemId))
      .orderBy(desc(imageProcessingJobs.createdAt))
      .limit(1);
    
    if (!job) {
      res.status(404).json({
        success: false,
        error: 'No jobs found for this item',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: job,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting latest item job:', error);
    
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
