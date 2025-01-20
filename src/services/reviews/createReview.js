import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to create a new review in the database
const createReview = async (reviewData) => {
  try {
    // Destructure the reviewData object for clarity
    const { userId, propertyId, rating, comment } = reviewData;

    // Create a new review
    const newReview = await prisma.review.create({
      data: {
        userId,      // Associate the review with the user
        propertyId,  // Associate the review with the property
        rating,      // Store the rating
        comment,     // Store the comment (optional)
      },
    });

    console.log('New review created:', newReview);
    return newReview;
  } catch (error) {
    console.error('Error creating review:', error.message);
    throw new Error('Failed to create the review.');
  }
};

export default createReview;
