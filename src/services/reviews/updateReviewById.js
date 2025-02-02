import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to update a review by its ID
const updateReviewById = async (id, updatedFields) => {
  try {
    // 👮🏻‍♂️ Define allowed fields for updating
    const allowedFields = ["rating", "comment"];
    
    // 👮🏻‍♂️ Filter out unwanted fields
    const filteredFields = Object.keys(updatedFields)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    if (Object.keys(filteredFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    // 👮🏻‍♂️ Validate rating if it's present
    if ("rating" in filteredFields) {
      const rating = filteredFields.rating;
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        throw new Error("Rating must be a number between 1 and 5.");
      }
    }

    // Update the review with the validated fields
    const updatedReview = await prisma.review.update({
      where: { id }, // Identify the review to update by ID
      data: filteredFields, // Update only valid fields
    });

    console.log(`✅ Review with ID ${id} updated:`, updatedReview);
    return updatedReview;
  } catch (error) {
    if (error.code === "P2025") {
      console.warn(`⚠️ Review with ID ${id} not found.`);
      return null;
    }
    console.error("❌ Error updating review:", error.message);
    throw new Error("Failed to update the review.");
  }
};

export default updateReviewById;

