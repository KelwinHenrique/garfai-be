/**
 * Agents Router
 * 
 * Defines routes for AI agent interactions
 */
import { Router } from 'express';
import { processFoodImage } from './food-image-handler';

/**
 * Initialize agents router with all agent-related endpoints
 * 
 * @returns Express router with configured routes
 */
const agentsRouter = Router();

// Food image processing endpoint
agentsRouter.post('/food-image', processFoodImage);

export default agentsRouter;
