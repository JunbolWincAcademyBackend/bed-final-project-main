import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to update a review by its ID
const updateReviewById = async (id, updatedFields) => {
  try {
    // Update the review with the provided fields
    const updatedReview = await prisma.review.update({
      where: { id }, // Identify the review to update by ID
      data: updatedFields, // Update fields (e.g., rating, comment)
    });

    console.log(`Review with ID ${id} updated:`, updatedReview);
    return updatedReview;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`Review with ID ${id} not found.`);
      return null;
    }
    console.error('Error updating review:', error.message);
    throw new Error('Failed to update the review.');
  }
};

export default updateReviewById;
