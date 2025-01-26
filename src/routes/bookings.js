import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios
import getBookings from '../services/bookings/getBookings.js'; // Import the getBookings service

const prisma = new PrismaClient(); // Initialize Prisma Client
const bookingsRouter = express.Router(); // Create a router for bookings

// **Route to fetch all bookings with optional query parameters**
bookingsRouter.get('/', async (req, res, next) => {
  try {
    // Extract query parameters from the request
    const { userId, propertyId, bookingStatus } = req.query; // Query parameters to filter bookings. I added more queries than the required by the assignment, to make it more complete.

    // Call the getBookings service with the extracted query parameters ✅
    const bookings = await getBookings({ userId, propertyId, bookingStatus });

    res.status(200).json(bookings); // Respond with the list of bookings
  } catch (error) {
    console.error('Error fetching bookings:', error.message); // Log any errors
    next(error); // Pass errors to centralized error-handling middleware
  }
});

// **Route to fetch a booking by ID**
bookingsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract booking ID from the request parameters

    // Fetch the booking by ID
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,       // Include the user who made the booking
        property: true,   // Include the property associated with the booking
      },
    });

    if (!booking) {
      throw new NotFoundError('Booking', id); // If booking not found, throw a custom error
    }

    res.status(200).json(booking); // Respond with the booking details
  } catch (error) {
    console.error('Error fetching booking by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new booking**
bookingsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract booking details from the request body
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    // Create the new booking
    const newBooking = await prisma.booking.create({
      data: { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus },
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

// **Route to update a booking by ID**
bookingsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract booking ID from the request parameters
    const updatedFields = req.body; // Extract fields to update

    // Update the booking
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
      next(new NotFoundError('Booking', id)); // Handle "not found" error
    } else {
      console.error('Error updating booking:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete a booking by ID**
bookingsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract booking ID from the request parameters

    // Delete the booking
    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Booking with ID ${id} successfully deleted`,
      booking: deletedBooking, // Include details of the deleted booking
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Booking', id)); // Handle "not found" error
    } else {
      console.error('Error deleting booking:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default bookingsRouter;
