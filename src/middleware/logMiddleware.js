import logger from '../utils/log.js';

// Middleware to log requests
const log = (req, res, next) => {
  // Capture the start time of the request
  const start = new Date();

  // Listen for when the response is finished
  res.on('finish', () => {
    // Calculate the duration once the response is sent
    const ms = new Date() - start;

    // Log details about the request and response
    logger.info(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}, Duration: ${ms} ms`);
  });

  // Call the next middleware or route handler
  next();
};

// Export the middleware function for use in your app
export default log;
