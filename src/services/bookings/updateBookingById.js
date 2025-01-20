import { PrismaClient } from '@prisma/client'; // Import the Prisma Client

const prisma = new PrismaClient(); // Initialize the Prisma Client

/**
 * Function to update an existing booking by its ID in the database.
 * 
 * How This Works:
 * - The function accepts the `id` of the booking to be updated and the new fields (`updatedFields`).
 * - Prisma's `update` method is used to modify the booking's details directly in the database.
 * - If the booking does not exist, Prisma throws an error, which we handle.
 * - Updated fields are passed as a dynamic object, ensuring flexibility and clean updates.
 */
const updateBookingById = async (id, updatedFields) => {
  try {
    // Attempt to update the booking with the provided `id` and `updatedFields`
    const updatedBooking = await prisma.booking.update({
      where: { id }, // Specify the booking to update by its ID
      data: updatedFields, // Provide the fields to update dynamically
    });

    console.log('Booking successfully updated:', updatedBooking); // Log the updated booking for debugging

    return updatedBooking; // Return the updated booking details
  } catch (error) {
    // Check if the error is a Prisma-specific "record not found" error
    if (error.code === 'P2025') {
      console.warn(`Booking with ID ${id} not found`); // Warn if the booking doesn't exist
      return null; // Return `null` to indicate no booking was found
    }

    // Log other errors encountered during the update process
    console.error('Error updating booking:', error.message);

    // Throw a generic error to indicate failure in booking update
    throw new Error('Failed to update booking.');
  }
};

export default updateBookingById;
