import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new review in the database
const createReview = async (reviewData) => {
  try {
    // Destructure the reviewData object for clarity
    const { userId, propertyId, rating, comment } = reviewData;

    // Create a new review
    const newReview = await prisma.review.create({
      data: {
        id: uuidv4(),  // ✅ Generate a unique ID for the review
        userId,        // Associate the review with the user
        propertyId,    // Associate the review with the property
        rating,        // Store the rating
        comment,       // Store the comment (optional)
      },
    });

    console.log('New review created:', newReview); // Debug log
    return newReview; // Return the newly created review
  } catch (error) {
    console.error('Error creating review:', error.message); // Log any errors
    throw new Error('Failed to create the review.'); // Throw a generic error for upstream handling
  }
};

export default createReview; 
