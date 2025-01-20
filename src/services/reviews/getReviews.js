import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to fetch all reviews from the database
const getReviews = async () => {
  try {
    // Fetch all reviews with their related user and property details
    const reviews = await prisma.review.findMany({
      include: {
        user: true,     // Include the user who wrote the review
        property: true, // Include the property being reviewed
      },
    });

    // Return the list of reviews
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    throw new Error('Failed to fetch reviews.');
  }
};

export default getReviews;
