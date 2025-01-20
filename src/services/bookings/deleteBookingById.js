import { PrismaClient } from '@prisma/client'; // Import the Prisma Client

const prisma = new PrismaClient(); // Initialize the Prisma Client

/**
 * Function to delete a booking by its ID from the database.
 *
 * How This Works:
 * - The function accepts the `id` of the booking to delete.
 * - Prisma's `delete` method removes the booking record from the database.
 * - If the booking does not exist, Prisma throws an error, which is handled to return `null`.
 */
const deleteBookingById = async (id) => {
  try {
    // Attempt to delete the booking with the provided `id`
    const deletedBooking = await prisma.booking.delete({
      where: { id }, // Specify the booking to delete by its ID
    });

    console.log('Booking successfully deleted:', deletedBooking); // Log the deleted booking for debugging

    return deletedBooking; // Return the details of the deleted booking
  } catch (error) {
    // Check if the error is a Prisma-specific "record not found" error
    if (error.code === 'P2025') {
      console.warn(`Booking with ID ${id} not found`); // Warn if the booking doesn't exist
      return null; // Return `null` to indicate no booking was found
    }

    // Log other errors encountered during the deletion process
    console.error('Error deleting booking:', error.message);

    // Throw a generic error to indicate failure in booking deletion
    throw new Error('Failed to delete booking.');
  }
};

export default deleteBookingById;
