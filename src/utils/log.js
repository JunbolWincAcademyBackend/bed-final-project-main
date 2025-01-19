import winston from 'winston';

// Create a Winston logger instance with configuration
const logger = winston.createLogger({
  level: 'info', // Set the default log level to "info" (can be adjusted)
  
  // Format the logs in JSON format for structured logging
  format: winston.format.json(),
  
  // Meta information to add to each log message
  defaultMeta: { service: 'booking-api' }, // Updated for the Booking API
});

// Add console logging during development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      // Use a simple, readable format for console logs during development
      format: winston.format.simple(),
    })
  );
}

// Export the logger instance for use throughout the application
export default logger;
