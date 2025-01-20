import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to delete a review by its ID
const deleteReviewById = async (id) => {
  try {
    // Delete the review with the specified ID
    const deletedReview = await prisma.review.delete({
      where: { id },
    });

    console.log(`Review with ID ${id} deleted.`);
    return deletedReview;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`Review with ID ${id} not found.`);
      return null;
    }
    console.error('Error deleting review:', error.message);
    throw new Error('Failed to delete the review.');
  }
};

export default deleteReviewById;
