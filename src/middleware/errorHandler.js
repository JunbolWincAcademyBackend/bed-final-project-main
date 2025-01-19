/*
 General error-handling middleware for the application.
 Catches errors passed down the middleware chain and formats the response.
 
err - The error object containing details of the error.
req - The HTTP request object.
res - The HTTP response object.
next - The next middleware function.

 */
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes (includes stack trace in development)
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      status: err.status || 500,
    });
  
    // Determine the HTTP status code
    const statusCode = err.status || 500;
  
    // Construct the error response object
    const errorResponse = {
      message: err.message || 'An unexpected error occurred.',
    };
  
    // Include the stack trace only in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = err.stack;
    }
  
    // Respond with the error details
    res.status(statusCode).json(errorResponse);
  };
  
  export default errorHandler;
  