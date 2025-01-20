import express from 'express'; // Import Express to create the router
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import custom middleware for authentication
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

const prisma = new PrismaClient(); // Initialize Prisma Client
const bookingsRouter = express.Router(); // Create a new router for bookings

// **Route to get all bookings**
bookingsRouter.get('/', async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true, // Include user details in the response
        property: true, // Include property details in the response
      },
    }); // Fetch all bookings with related data
    res.status(200).json(bookings); // Respond with the list of bookings as JSON
  } catch (error) {
    console.error('Error fetching bookings:', error.message); // Log the error for debugging
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new booking**
bookingsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract booking details from the request body
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    // Use Prisma to create a new booking in the database
    const newBooking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate: new Date(checkinDate), // Ensure dates are properly formatted
        checkoutDate: new Date(checkoutDate),
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
    });

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to get a booking by ID**
bookingsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract booking ID from the request parameters
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true, // Include user details
        property: true, // Include property details
      },
    });

    if (!booking) {
      throw new NotFoundError('Booking', id); // If the booking doesn't exist, throw a custom error
    }

    res.status(200).json(booking); // Respond with the booking details
  } catch (error) {
    console.error('Error fetching booking by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update a booking by ID**
bookingsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract booking ID from the request parameters
    const updatedFields = req.body; // Get the updated booking details from the request body

    // Update the booking in the database
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updatedFields,
    });

    res.status(200).json({
      message: `Booking with ID ${id} successfully updated`,
      booking: updatedBooking,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Booking', id)); // Handle "not found" error with Prisma's error code
    } else {
      console.error('Error updating booking:', error.message);
      next(error); // Pass other errors to the error-handling middleware
    }
  }
});

// **Route to delete a booking by ID**
bookingsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedBooking = await prisma.booking.delete({
      where: { id }, // Delete the booking by ID
    });

    res.status(200).json({
      message: `Booking with ID ${id} successfully deleted`,
      booking: deletedBooking, // Include details of the deleted booking in the response
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Booking', id)); // Handle "not found" error with Prisma's error code
    } else {
      console.error('Error deleting booking:', error.message);
      next(error); // Pass other errors to the error-handling middleware
    }
  }
});

export default bookingsRouter; // Export the router for use in the app
