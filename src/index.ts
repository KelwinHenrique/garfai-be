/**
 * Main application entry point for GarfAI Backend
 * 
 * This file sets up the Express server with a basic hello world route.
 */
import express, { Request, Response } from 'express';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

/**
 * Hello world route
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Response with hello world message
 */
app.get('/', (req: Request, res: Response) => {
  return res.json({
    message: 'Hello World from GarfAI Backend!',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
