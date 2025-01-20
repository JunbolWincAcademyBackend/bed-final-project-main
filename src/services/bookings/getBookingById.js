import { PrismaClient } from '@prisma/client'; // Import the Prisma Client

const prisma = new PrismaClient(); // Initialize the Prisma Client

/**
 * Function to get a booking by its unique ID from the database.
 * 
 * How This Works:
 * - The function uses Prisma's `findUnique` method to query the database for a specific booking.
 * - Relationships (`user` and `property`) are included to fetch associated data for convenience.
 * - If no booking is found with the given ID, the function returns `null`.
 */
const getBookingById = async (id) => {
  try {
    // Use Prisma to find the booking by its unique ID
    const booking = await prisma.booking.findUnique({
      where: { id }, // Match the booking's ID to the one provided in the argument
      include: {
        user: true, // Include the associated user details
        property: true, // Include the associated property details
      },
    });

    // Return the booking, or null if not found
    return booking;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching booking by ID:', error.message);

    // Throw a generic error to indicate a failure in fetching the booking
    throw new Error('Failed to fetch the booking by ID.');
  }
};

export default getBookingById;
