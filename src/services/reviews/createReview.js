import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new review in the database
const createReview = async (reviewData) => {
  try {
    // Destructure the reviewData object for clarity
    const { userId, propertyId, rating, comment } = reviewData;

    // ✅ Validate required fields
    if (!userId || !propertyId || rating === undefined) {
      const missingFields = [];
      if (!userId) missingFields.push('userId');
      if (!propertyId) missingFields.push('propertyId');
      if (rating === undefined) missingFields.push('rating');

      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);

      // ✅ Fix: Ensure validation errors return 400
      const validationError = new Error(errorMessage);
      validationError.statusCode = 400;
      throw validationError;
    }

    // 👮🏻‍♂️ Validate rating (must be between 1-5)
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      console.warn(`⚠️ Validation Failed: Rating must be a number between 1 and 5.`);

      // ✅ Fix: Return 400 instead of generic error
      const ratingError = new Error('Rating must be a number between 1 and 5.');
      ratingError.statusCode = 400;
      throw ratingError;
    }

    // Create a new review
    const newReview = await prisma.review.create({
      data: {
        userId, // Associate the review with the user
        propertyId, // Associate the review with the property
        rating, // Store the rating
        comment, // Store the comment (optional)
      },
    });

    console.log('✅ New review created:', newReview); // Debug log
    return newReview; // Return the newly created review
  } catch (error) {
    console.error('❌ Error creating review:', error.message); // Log any errors

    // ✅ Fix: Ensure proper status codes
    if (!error.statusCode) error.statusCode = 500;

    throw error;
  }
};

export default createReview;
