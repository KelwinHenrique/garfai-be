import cors from 'cors';

/**
 * CORS middleware configuration
 * 
 * This middleware handles Cross-Origin Resource Sharing (CORS) configuration
 * to allow or deny requests from different origins.
 */
const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FE_BASE_URL, 'http://localhost:5173'];

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

export default corsMiddleware; 