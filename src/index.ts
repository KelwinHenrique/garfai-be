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
import { configurePassport, validateApiKeyForPublicEndpoints } from './auth';

// Initialize express app
const app = express();
const { PORT } = SERVER_CONFIG;

// Configure Passport.js
configurePassport();

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure session middleware
app.use(
  session({
    secret: AUTH_CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: SERVER_CONFIG.NODE_ENV === 'production',
      maxAge: AUTH_CONFIG.COOKIE_MAX_AGE,
    },
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// API key validation for public endpoints
// Define which paths require API key validation
const publicPaths = [
  '/api/public',  // Example public API path
  '/clients/public'  // Example public client path
];
app.use(validateApiKeyForPublicEndpoints(publicPaths));

// Initialize routes
app.use(initRoutes());

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
