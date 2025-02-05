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

    // ✅ Validate required fields
    if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice) {
      const missingFields = [];
      if (!userId) missingFields.push("userId");
      if (!propertyId) missingFields.push("propertyId");
      if (!checkinDate) missingFields.push("checkinDate");
      if (!checkoutDate) missingFields.push("checkoutDate");
      if (!numberOfGuests) missingFields.push("numberOfGuests");
      if (!totalPrice) missingFields.push("totalPrice");

      const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);

      // ✅ Fix: Ensure validation errors return 400
      const validationError = new Error(errorMessage);
      validationError.statusCode = 400;
      throw validationError;
    }

    // ✅ Validate check-in and check-out dates
    const parsedCheckinDate = new Date(checkinDate);
    const parsedCheckoutDate = new Date(checkoutDate);

    if (isNaN(parsedCheckinDate.getTime()) || isNaN(parsedCheckoutDate.getTime())) {
      const dateError = new Error('Invalid date format. Check-in and check-out dates must be valid dates.');
      dateError.statusCode = 400; // 🔥 Fix: Return 400 for invalid dates
      throw dateError;
    }

    if (parsedCheckoutDate <= parsedCheckinDate) {
      const dateOrderError = new Error('Check-out date must be after check-in date.');
      dateOrderError.statusCode = 400; // 🔥 Fix: Ensure checkout is after check-in
      throw dateOrderError;
    }

    // Create a new booking in the database
    const newBooking = await prisma.booking.create({
      data: {
        userId,       // Associate the booking with a specific user
        propertyId,   // Associate the booking with a specific property
        checkinDate: parsedCheckinDate, // Ensure the check-in date is stored as a Date object
        checkoutDate: parsedCheckoutDate, // Ensure the check-out date is stored as a Date object
        numberOfGuests, // Number of guests for the booking
        totalPrice,   // Total price for the booking
        bookingStatus, // Current status of the booking (e.g., confirmed, pending)
      },
    });

    console.log('✅ New booking created:', newBooking); // Log the new booking for debugging

    return newBooking; // Return the created booking
  } catch (error) {
    // Log any errors encountered during the creation process
    console.error('❌ Error creating booking:', error.message);

    // ✅ Fix: Ensure errors return proper status codes
    if (!error.statusCode) error.statusCode = 500;
    
    throw error;
  }
};

export default createBooking;

