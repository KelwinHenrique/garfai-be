/**
 * Agents Router
 * 
 * Defines routes for AI agent interactions
 */
import { Router } from 'express';
import { processFoodImage, getJobStatus } from './food-image-handler';

/**
 * Initialize agents router with all agent-related endpoints
 * 
 * @returns Express router with configured routes
 */
const agentsRouter = Router();

// Food image processing endpoints
agentsRouter.post('/food-image', processFoodImage);
agentsRouter.get('/food-image/job/:jobId', getJobStatus);

export default agentsRouter;
