import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios
import getHosts from '../services/getHosts.js'; // Import the getHosts service

const prisma = new PrismaClient(); // Initialize Prisma Client
const hostsRouter = express.Router(); // Create a router for hosts

// **Route to fetch all hosts with optional query parameters**
hostsRouter.get('/', async (req, res, next) => {
  try {
    // Extract query parameters from the request
    const { name, email } = req.query; // Query parameters to filter hosts by name or email

    // Call the getHosts service with the extracted query parameters ✅
    const hosts = await getHosts({ name, email });

    res.status(200).json(hosts); // Respond with the list of hosts
  } catch (error) {
    console.error('Error fetching hosts:', error.message); // Log any errors
    next(error); // Pass errors to centralized error-handling middleware
  }
});

// **Route to fetch a host by ID**
hostsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract host ID from the request parameters

    // Fetch the host by ID
    const host = await prisma.host.findUnique({
      where: { id },
    });

    if (!host) {
      throw new NotFoundError('Host', id); // If host not found, throw a custom error
    }

    res.status(200).json(host); // Respond with the host details
  } catch (error) {
    console.error('Error fetching host by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new host**
hostsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract host details from the request body
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    // Create the new host
    const newHost = await prisma.host.create({
      data: { username, password, name, email, phoneNumber, profilePicture, aboutMe },
    });

    res.status(201).json({
      message: 'Host created successfully!',
      host: newHost,
    });
  } catch (error) {
    console.error('Error creating host:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update a host by ID**
hostsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract host ID from the request parameters
    const updatedFields = req.body; // Extract fields to update

    // Update the host
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
      next(new NotFoundError('Host', id)); // Handle "not found" error
    } else {
      console.error('Error updating host:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete a host by ID**
hostsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract host ID from the request parameters

    // Delete the host
    const deletedHost = await prisma.host.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Host with ID ${id} successfully deleted`,
      host: deletedHost, // Include details of the deleted host
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Host', id)); // Handle "not found" error
    } else {
      console.error('Error deleting host:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default hostsRouter;
