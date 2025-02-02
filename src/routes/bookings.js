import express from 'express'; // Import Express for creating routes
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

// ✅ Import services from the bookings folder
import getBookings from '../services/bookings/getBookings.js';
import getBookingById from '../services/bookings/getBookingById.js';
import createBooking from '../services/bookings/createBooking.js';
import updateBookingById from '../services/bookings/updateBookingById.js';
import deleteBookingById from '../services/bookings/deleteBookingById.js';

const bookingsRouter = express.Router(); // Create a router for bookings

// **Route to fetch all bookings with optional query parameters**
bookingsRouter.get('/', async (req, res, next) => {
  try {
    const { userId, propertyId, bookingStatus } = req.query; // Extract query parameters
    const bookings = await getBookings({ userId, propertyId, bookingStatus }); // ✅ Use service
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    next(error);
  }
});

// **Route to fetch a booking by ID**
bookingsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract booking ID
    const booking = await getBookingById(id); // ✅ Use service

    if (!booking) {
      throw new NotFoundError('Booking', id);
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking by ID:', error.message);
    next(error);
  }
});

// **Route to create a new booking**
bookingsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;
    const newBooking = await createBooking({ userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus }); // ✅ Use service

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    next(error);
  }
});

// **Route to update a booking by ID**
bookingsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedBooking = await updateBookingById(id, updatedFields); // ✅ Use service

    if (!updatedBooking) {
      throw new NotFoundError('Booking', id);
    }

    res.status(200).json({
      message: `Booking with ID ${id} successfully updated`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking:', error.message);
    next(error);
  }
});

// **Route to delete a booking by ID**
bookingsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBooking = await deleteBookingById(id); // ✅ Use service

    if (!deletedBooking) {
      throw new NotFoundError('Booking', id);
    }

    res.status(200).json({
      message: `Booking with ID ${id} successfully deleted`,
      booking: deletedBooking,
    });
  } catch (error) {
    console.error('Error deleting booking:', error.message);
    next(error);
  }
});

export default bookingsRouter;
