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
    // 🚩 Define allowed fields for updating
    const allowedFields = ['checkinDate', 'checkoutDate', 'numberOfGuests', 'totalPrice', 'bookingStatus'];

    // 🚩 Filter out any invalid fields before updating
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    // 🚩 If no valid fields are provided, return an error
    if (Object.keys(filteredFields).length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    // 🚩 Update the booking with only valid fields
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: filteredFields,
    });

    console.log('✅ Booking successfully updated:', updatedBooking);
    return updatedBooking;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`⚠️ Booking with ID ${id} not found.`);
      return null;
    }
    console.error('❌ Error updating booking:', error.message);
    throw new Error('Failed to update booking.');
  }
};

export default updateBookingById;
