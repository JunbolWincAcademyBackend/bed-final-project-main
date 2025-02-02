import { PrismaClient } from '@prisma/client'; // Import the Prisma Client

const prisma = new PrismaClient(); // Initialize the Prisma Client

/**
 * Function to create a new booking in the database.
 * 
 * How This Works:
 * - The function accepts details about the booking (e.g., dates, guest count, etc.) and inserts them into the `booking` table using Prisma's `create` method.
 * - The `data` object specifies the fields to be inserted and their values.
 * - Relationships (e.g., `userId`, `propertyId`) are included to link the booking to the appropriate user and property.
 * - The function returns the newly created booking.
 */
const createBooking = async (bookingData) => {
  try {
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = bookingData;
    // Create a new booking in the database
    const newBooking = await prisma.booking.create({
      data: {
        userId,       // Associate the booking with a specific user
        propertyId,   // Associate the booking with a specific property
        checkinDate: new Date(checkinDate), // Ensure the check-in date is stored as a Date object
        checkoutDate: new Date(checkoutDate), // Ensure the check-out date is stored as a Date object
        numberOfGuests, // Number of guests for the booking
        totalPrice,   // Total price for the booking
        bookingStatus, // Current status of the booking (e.g., confirmed, pending)
      },
    });

    console.log('New booking created:', newBooking); // Log the new booking for debugging

    return newBooking; // Return the created booking
  } catch (error) {
    // Log any errors encountered during the creation process
    console.error('❌Error creating booking:', error.message);

    // Throw a generic error to indicate failure in booking creation
    throw new Error('Failed to create booking.');
  }
};

export default createBooking; 
