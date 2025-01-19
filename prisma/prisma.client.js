import { PrismaClient } from '@prisma/client';

// Create an instance of Prisma Client
const prismaGuard = new PrismaClient();

/*
  Middleware Overview:
  Middleware in Prisma acts as an intermediate layer that intercepts all database queries before they are executed.
  It allows you to add custom logic, such as validation or logging, for specific operations.
*/

prismaGuard.$use(async (params, next) => {
  /*
    Example Middleware: Validates the creation of a `Booking`
    This middleware checks if the `userId` in the `Booking` model exists in the `User` model before creating a new `Booking`.
    If the `userId` is invalid, it throws an error to prevent the operation.
  */
  if (params.model === 'Booking' && params.action === 'create') {
    // Check if the user exists in the User model
    const userExists = await prismaGuard.user.findUnique({
      where: { id: params.args.data.userId }, // Query the User table using the userId
    });
    if (!userExists) {
      // If no user is found, throw an error to block the operation
      throw new Error('User does not exist!');
    }
  }
  /*
    The `next` function proceeds to the next middleware (if any) or executes the actual database query.
    Without calling `next(params)`, the query won't be executed.
  */
  return next(params);
});

/*
  Exporting the Prisma Guard:
  The `prismaGuard` instance is exported to be used across the application for all database interactions.
  Middleware ensures that global rules, such as data validation or logging, are applied consistently.
  Use this instance in your route handlers or services to interact with the database securely and reliably.
*/
export default prismaGuard;

// EXAMPLE HOW TO USE IT:

// routes/bookings.js
/* import express from 'express';
import prismaGuard from '../prisma/prisma.client.js'; // Import renamed instance

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const booking = await prismaGuard.booking.create({
      data: req.body,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; */


