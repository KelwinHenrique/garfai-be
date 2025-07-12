/**
 * Main application entry point for GarfAI Backend
 * 
 * This file sets up the Express server and configures middleware and routes.
 */
import express from 'express';
import { SERVER_CONFIG } from './config/app-config';
import { initRoutes } from './handlers';
import { errorHandler } from './utils';

// Initialize express app
const app = express();
const { PORT } = SERVER_CONFIG;

// Middleware for parsing JSON
app.use(express.json());

// Initialize routes
app.use(initRoutes());

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
