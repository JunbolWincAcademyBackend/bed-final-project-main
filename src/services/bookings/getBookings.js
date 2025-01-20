import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database operations

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Service to retrieve bookings with optional filters for userId and propertyId.
 *
 * How This Works:
 * - Filters (`userId` and `propertyId`) are optional.
 * - If no filters are provided, the function fetches all bookings.
 * - The `where` clause dynamically includes filters based on the provided arguments.
 * - Prisma queries the database directly, making filtering efficient and avoiding in-memory filtering.
 */
const getBookings = async (userId, propertyId) => {
  try {
    // Log input filters for debugging
    console.log('Fetching bookings with filters:', { userId, propertyId });

    // Use Prisma to query the database with optional filters
    const bookings = await prisma.booking.findMany({
      where: {
        ...(userId && { userId }), // (...) spreads (unwraps) the conditional object { userId: userId } into the surrounding parent object `where` clause only if `userId` is provided. The `&&` ensures this happens conditionally, avoiding undefined values. For example, if userId is '123', this becomes { userId: '123' }.

        ...(propertyId && { propertyId }), // Similarly, this adds the propertyId filter conditionally if propertyId is provided.
      },
      include: {
        user: true, // Include related user details in the response
        property: true, // Include related property details in the response
      },
    });

    // Log the retrieved bookings for debugging
    console.log('Retrieved bookings:', bookings);

    return bookings; // Return the filtered list of bookings
  } catch (error) {
    console.error('Error fetching bookings:', error.message); // Log any errors that occur

    // Throw a new error to ensure it is handled by the calling function
    throw new Error('Failed to fetch bookings.');
  }
};

export default getBookings;
