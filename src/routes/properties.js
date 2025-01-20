import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

const prisma = new PrismaClient(); // Initialize Prisma Client
const propertiesRouter = express.Router(); // Create a router for properties

// **Route to fetch all properties**
propertiesRouter.get('/', async (req, res, next) => {
  try {
    // Fetch all properties from the database
    const properties = await prisma.property.findMany({
      include: {
        amenities: true, // Include associated amenities
        reviews: true,   // Include associated reviews
        host: true,      // Include the host who owns the property
      },
    });

    res.status(200).json(properties); // Respond with the list of properties
  } catch (error) {
    console.error('Error fetching properties:', error.message); // Log any errors
    next(error); // Pass errors to centralized error-handling middleware
  }
});

// **Route to fetch a property by ID**
propertiesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract property ID from the request parameters

    // Fetch the property by ID, including related data
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        amenities: true, // Include associated amenities
        reviews: true,   // Include associated reviews
        host: true,      // Include the host who owns the property
      },
    });

    if (!property) {
      throw new NotFoundError('Property', id); // If property not found, throw a custom error
    }

    res.status(200).json(property); // Respond with the property details
  } catch (error) {
    console.error('Error fetching property by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new property**
propertiesRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract property details from the request body
    const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId, amenityIds } = req.body;

    // Create the new property and link amenities using their IDs
    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        hostId,
        amenities: {
          connect: amenityIds.map((id) => ({ id })), // Relate amenities by their IDs
        },
      },
    });

    res.status(201).json({
      message: 'Property created successfully!',
      property: newProperty,
    });
  } catch (error) {
    console.error('Error creating property:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update a property by ID**
propertiesRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract property ID from the request parameters
    const { amenityIds, ...updatedFields } = req.body; // Extract amenity IDs and other fields to update

    // Update the property, including its amenities if provided
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...updatedFields,
        amenities: amenityIds
          ? {
              set: amenityIds.map((amenityId) => ({ id: amenityId })), // Update amenities
            }
          : undefined, // Skip updating amenities if not provided
      },
    });

    res.status(200).json({
      message: `Property with ID ${id} successfully updated`,
      property: updatedProperty,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Property', id)); // Handle "not found" error
    } else {
      console.error('Error updating property:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete a property by ID**
propertiesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract property ID from the request parameters

    // Delete the property from the database
    const deletedProperty = await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Property with ID ${id} successfully deleted`,
      property: deletedProperty, // Include details of the deleted property
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Property', id)); // Handle "not found" error
    } else {
      console.error('Error deleting property:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default propertiesRouter; // Export the router for use in the app
