import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios
import getProperties from '../services/properties/getProperties.js'; // Import the getProperties service

const prisma = new PrismaClient(); // Initialize Prisma Client
const propertiesRouter = express.Router(); // Create a router for properties

// **Route to fetch all properties with optional query parameters**
propertiesRouter.get('/', async (req, res, next) => {
  try {
    const { location, pricePerNight, amenities } = req.query;
    const properties = await getProperties({ location, pricePerNight, amenities });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error); // 🚩 Log the entire error object
    next(error);
  }
});

// **Route to fetch a property by ID**
propertiesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        amenities: true,
        reviews: true,
        host: true,
      },
    });

    if (!property) {
      throw new NotFoundError('Property', id);
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error); // 🚩 Log the entire error object
    next(error);
  }
});

// **Route to create a new property**
propertiesRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      hostId,
      amenityIds,
    } = req.body;

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
        amenities: amenityIds?.length
          ? { connect: amenityIds.map((id) => ({ id })) } // 🚩 Ensure amenityIds is valid
          : undefined,
      },
    });

    res.status(201).json({
      message: 'Property created successfully!',
      property: newProperty,
    });
  } catch (error) {
    console.error('Error creating property:', error); // 🚩 Log the full error
    next(error);
  }
});

// **Route to update a property by ID**
propertiesRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amenityIds, ...updatedFields } = req.body;

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...updatedFields,
        amenities: amenityIds?.length ? { set: amenityIds.map((amenityId) => ({ id: amenityId })) } : undefined,
      },
      include: {
        amenities: true,
        reviews: true,
        host: true,
      }, // 🚩 Ensure related fields are included
    });

    res.status(200).json({
      message: `Property with ID ${id} successfully updated`,
      property: updatedProperty,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Property', id));
    } else {
      console.error('Error updating property:', error.message);
      next(error);
    }
  }
});

// **Route to delete a property by ID**
propertiesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProperty = await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Property with ID ${id} successfully deleted`,
      property: deletedProperty,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Property', id));
    } else {
      console.error('Error deleting property:', error.message);
      next(error);
    }
  }
});

export default propertiesRouter;
