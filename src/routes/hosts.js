import express from 'express'; // Import Express to create the router
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import custom middleware for authentication
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

const prisma = new PrismaClient(); // Initialize Prisma Client
const hostsRouter = express.Router(); // Create a new router for hosts

// **Route to get all hosts**
hostsRouter.get('/', async (req, res, next) => {
  try {
    const hosts = await prisma.host.findMany(); // Fetch all hosts from the database
    res.status(200).json(hosts); // Respond with the list of hosts as JSON
  } catch (error) {
    console.error('Error fetching hosts:', error.message); // Log the error for debugging
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new host**
hostsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract host details from the request body
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    // Use Prisma to create a new host in the database
    const newHost = await prisma.host.create({
      data: { username, password, name, email, phoneNumber, profilePicture, aboutMe },
    });

    res.status(201).json({
      message: 'Host created successfully!',
      host: newHost,
    });
  } catch (error) {
    console.error('Error creating host:', error.message); // Log the error for debugging
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to get a host by ID**
hostsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the host ID from the request parameters
    const host = await prisma.host.findUnique({
      where: { id }, // Find the host by ID
    });

    if (!host) {
      throw new NotFoundError('Host', id); // If the host doesn't exist, throw a custom error
    }

    res.status(200).json(host); // Respond with the host's details
  } catch (error) {
    console.error('Error fetching host by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update a host by ID**
hostsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the host ID from the request parameters
    const updatedFields = req.body; // Get the updated host details from the request body

    // Update the host in the database
    const updatedHost = await prisma.host.update({
      where: { id },
      data: updatedFields,
    });

    res.status(200).json({
      message: `Host with ID ${id} successfully updated`,
      host: updatedHost,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Host', id)); // Handle "not found" error with Prisma's error code
    } else {
      console.error('Error updating host:', error.message);
      next(error); // Pass other errors to the error-handling middleware
    }
  }
});

// **Route to delete a host by ID**
hostsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedHost = await prisma.host.delete({
      where: { id }, // Delete the host by ID
    });

    res.status(200).json({
      message: `Host with ID ${id} successfully deleted`,
      host: deletedHost, // Include details of the deleted host in the response
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Host', id)); // Handle "not found" error with Prisma's error code
    } else {
      console.error('Error deleting host:', error.message);
      next(error); // Pass other errors to the error-handling middleware
    }
  }
});

export default hostsRouter; // Export the router for use in the app
