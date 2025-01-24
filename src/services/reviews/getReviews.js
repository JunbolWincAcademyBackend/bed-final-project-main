import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch all reviews from the database with optional filters
const getReviews = async (filters) => {
  try {
    // Destructure filters for clarity
    const { userId, propertyId, rating } = filters;

    // Fetch reviews with applied conditional filters ✅
    const reviews = await prisma.review.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(userId && { userId }), // Filter by user ID
        ...(propertyId && { propertyId }), // Filter by property ID
        ...(rating && { rating: parseInt(rating, 10) }), // Filter by rating
      },
      include: {
        user: true,       // Include the user who wrote the review
        property: true,   // Include the associated property
      },
    });

    // Return the list of filtered reviews
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    throw new Error('Failed to fetch reviews.');
  }
};

export default getReviews;


/* import { PrismaClient } from '@prisma/client';

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

export default getReviews; */
