/**
 * Agents Router
 * 
 * Defines routes for AI agent interactions
 */
import { Router } from 'express';
import { 
  processFoodImage, 
  getJobStatus, 
  getItemJobs, 
  getLatestItemJob 
} from './food-image-handler';

/**
 * Initialize agents router with all agent-related endpoints
 * 
 * @returns Express router with configured routes
 */
const agentsRouter = Router();

// Food image processing endpoints
agentsRouter.post('/food-image', processFoodImage);

// Job status endpoints
agentsRouter.get('/food-image/job/:jobId', getJobStatus);
agentsRouter.get('/food-image/item/:itemId/jobs', getItemJobs);
agentsRouter.get('/food-image/item/:itemId/latest', getLatestItemJob);

export default agentsRouter;
