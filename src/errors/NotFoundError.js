// Custom error class for 404 errors
class NotFoundError extends Error {
    constructor(resourceType, id) {
      super(`${resourceType} with id ${id} was not found!`); // Custom error message
      this.name = 'NotFoundError'; // Set error name
      this.statusCode = 404; // HTTP status code for "Not Found"
    }
  }
  
  export default NotFoundError;
  