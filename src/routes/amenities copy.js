import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

const prisma = new PrismaClient(); // Initialize Prisma Client
const amenitiesRouter = express.Router(); // Create a router for amenities

// **Route to fetch all amenities**
amenitiesRouter.get('/', async (req, res, next) => {
  try {
    // Fetch all amenities from the database
    const amenities = await prisma.amenity.findMany();
    res.status(200).json(amenities); // Respond with the list of amenities
  } catch (error) {
    console.error('Error fetching amenities:', error.message); // Log any errors
    next(error); // Pass errors to centralized error-handling middleware
  }
});

// **Route to fetch an amenity by ID**
amenitiesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract amenity ID from the request parameters

    // Fetch the amenity by ID
    const amenity = await prisma.amenity.findUnique({
      where: { id },
    });

    if (!amenity) {
      throw new NotFoundError('Amenity', id); // If amenity not found, throw a custom error
    }

    res.status(200).json(amenity); // Respond with the amenity details
  } catch (error) {
    console.error('Error fetching amenity by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new amenity**
amenitiesRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body; // Extract amenity details from the request body

    // Create a new amenity
    const newAmenity = await prisma.amenity.create({
      data: { name },
    });

    res.status(201).json({
      message: 'Amenity created successfully!',
      amenity: newAmenity,
    });
  } catch (error) {
    console.error('Error creating amenity:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update an amenity by ID**
amenitiesRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract amenity ID from the request parameters
    const { name } = req.body; // Extract the updated amenity name

    // Update the amenity
    const updatedAmenity = await prisma.amenity.update({
      where: { id },
      data: { name },
    });

    res.status(200).json({
      message: `Amenity with ID ${id} successfully updated`,
      amenity: updatedAmenity,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Amenity', id)); // Handle "not found" error
    } else {
      console.error('Error updating amenity:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete an amenity by ID**
amenitiesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract amenity ID from the request parameters

    // Delete the amenity
    const deletedAmenity = await prisma.amenity.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Amenity with ID ${id} successfully deleted`,
      amenity: deletedAmenity, // Include details of the deleted amenity
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Amenity', id)); // Handle "not found" error
    } else {
      console.error('Error deleting amenity:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default amenitiesRouter; // Export the router for use in the app
