/**
 * Main application entry point for GarfAI Backend
 * 
 * This file sets up the Express server and configures middleware and routes.
 */
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { SERVER_CONFIG, AUTH_CONFIG } from './config/app-config';
import { initRoutes } from './handlers';
import { errorHandler } from './utils';
import { configurePassport } from './auth';
import sessionMiddleware from './middlewares/sessionMiddleware';

// Initialize express app
const app = express();
const { PORT } = SERVER_CONFIG;

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuração do express-session usando MongoDB como armazenamento
app.use(sessionMiddleware)

// Configure Passport.js
configurePassport();

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize routes
app.use(initRoutes());

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
