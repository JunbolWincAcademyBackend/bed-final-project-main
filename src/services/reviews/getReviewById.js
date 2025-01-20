import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to fetch a specific review by its ID
const getReviewById = async (id) => {
  try {
    // Fetch the review by ID and include related data
    const review = await prisma.review.findUnique({
      where: { id }, // Search for a review with the matching ID
      include: {
        user: true,     // Include the user who wrote the review
        property: true, // Include the property being reviewed
      },
    });

    // If no review is found, log a warning and return null
    if (!review) {
      console.warn(`Review with ID ${id} not found.`);
      return null;
    }

    return review;
  } catch (error) {
    console.error('Error fetching review by ID:', error.message);
    throw new Error('Failed to fetch the review by ID.');
  }
};

export default getReviewById;
