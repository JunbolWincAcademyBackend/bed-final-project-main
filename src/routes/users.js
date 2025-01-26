import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios
import getUsers from '../services/users/getUsers.js'; // Import the getUsers service

const prisma = new PrismaClient(); // Initialize Prisma Client
const usersRouter = express.Router(); // Create a router for users

// **Route to fetch all users with optional query parameters**
usersRouter.get('/', async (req, res, next) => {
  try {
    // Extract query parameters from the request
    const { username, email } = req.query; // Query parameters to filter users. When a client sends a GET request to the /users endpoint with query parameters (e.g., GET /users?username=jdoe&email=johndoe@example.com), these query parameters (username and email) are sent along with the request.

    // Call the getUsers service with the extracted query parameters ✅
    const users = await getUsers({ username, email });

    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    console.error('Error fetching users:', error.message); // Log any errors
    next(error); // Pass errors to centralized error-handling middleware
  }
});

// **Route to fetch a user by ID**
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract user ID from the request parameters

    // Fetch the user by ID
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true, // Include associated bookings
        reviews: true,  // Include associated reviews
      },
    });

    if (!user) {
      throw new NotFoundError('User', id); // If user not found, throw a custom error
    }

    res.status(200).json(user); // Respond with the user details
  } catch (error) {
    console.error('Error fetching user by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new user**
usersRouter.post('/', async (req, res, next) => {
  try {
    // Extract user details from the request body
    const { username, password, name, email, phoneNumber, profilePicture } = req.body;

    // Create the new user
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

// **Route to update a user by ID**
usersRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract user ID from the request parameters
    const updatedFields = req.body; // Extract fields to update

    // Update the user
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
      next(new NotFoundError('User', id)); // Handle "not found" error
    } else {
      console.error('Error updating user:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete a user by ID**
usersRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract user ID from the request parameters

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: `User with ID ${id} successfully deleted`,
      user: deletedUser, // Include details of the deleted user
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('User', id)); // Handle "not found" error
    } else {
      console.error('Error deleting user:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default usersRouter;
