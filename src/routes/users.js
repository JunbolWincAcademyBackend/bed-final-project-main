import express from 'express'; // Import Express for routing
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

const prisma = new PrismaClient(); // Initialize Prisma Client
const usersRouter = express.Router(); // Create a new router for users

// **Route to get all users**
usersRouter.get('/', async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      include: {
        bookings: true, // Include related bookings in the response
        reviews: true,  // Include related reviews in the response
      },
    });
    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    console.error('Error fetching users:', error.message); // Log the error for debugging
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new user**
usersRouter.post('/', async (req, res, next) => {
  try {
    // Extract user details from the request body
    const { username, password, name, email, phoneNumber, profilePicture } = req.body;

    // Use Prisma to create a new user in the database
    const newUser = await prisma.user.create({
      data: { username, password, name, email, phoneNumber, profilePicture },
    });

    res.status(201).json({
      message: 'User created successfully!',
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to get a user by ID**
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract user ID from the request parameters

    // Fetch the user by ID, including their bookings and reviews
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true, // Include related bookings
        reviews: true,  // Include related reviews
      },
    });

    if (!user) {
      throw new NotFoundError('User', id); // If the user doesn't exist, throw a custom error
    }

    res.status(200).json(user); // Respond with the user details
  } catch (error) {
    console.error('Error fetching user by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update a user by ID**
usersRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract user ID from the request parameters
    const updatedFields = req.body; // Get the updated user details from the request body

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedFields,
    });

    res.status(200).json({
      message: `User with ID ${id} successfully updated`,
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('User', id)); // Handle "not found" error with Prisma's error code
    } else {
      console.error('Error updating user:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete a user by ID**
usersRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete the user from the database
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: `User with ID ${id} successfully deleted`,
      user: deletedUser, // Include details of the deleted user
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('User', id)); // Handle "not found" error with Prisma's error code
    } else {
      console.error('Error deleting user:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default usersRouter; // Export the router for use in the app
