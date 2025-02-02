import express from 'express'; // Import Express for creating routes
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

// Import services
import getAmenities from '../services/amenities/getAmenities.js';
import getAmenityById from '../services/amenities/getAmenityById.js';
import createAmenity from '../services/amenities/createAmenity.js';
import updateAmenityById from '../services/amenities/updateAmenityById.js';
import deleteAmenityById from '../services/amenities/deleteAmenityById.js';

const amenitiesRouter = express.Router(); // Create a router for amenities

// **Route to fetch all amenities**
amenitiesRouter.get('/', async (req, res, next) => {
  try {
    const { name } = req.query; // Query parameters to filter amenities by name
    const amenities = await getAmenities({ name });
    res.status(200).json(amenities);
  } catch (error) {
    console.error('Error fetching amenities:', error.message);
    next(error);
  }
});

// **Route to fetch an amenity by ID**
amenitiesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityById(id);

    if (!amenity) {
      throw new NotFoundError('Amenity', id);
    }

    res.status(200).json(amenity);
  } catch (error) {
    console.error('Error fetching amenity by ID:', error.message);
    next(error);
  }
});

// **Route to create a new amenity**
amenitiesRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body;
    const newAmenity = await createAmenity(name);

    res.status(201).json({
      message: 'Amenity created successfully!',
      amenity: newAmenity,
    });
  } catch (error) {
    console.error('Error creating amenity:', error.message);
    next(error);
  }
});

// **Route to update an amenity by ID**
amenitiesRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedAmenity = await updateAmenityById(id, { name });

    if (!updatedAmenity) {
      return res.status(404).json({ message: `Amenity with ID ${id} not found.` });
    }

    res.status(200).json({
      message: `Amenity with ID ${id} successfully updated`,
      amenity: updatedAmenity,
    });
  } catch (error) {
    console.error('Error updating amenity:', error.message);
    next(error);
  }
});

// **Route to delete an amenity by ID**
amenitiesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAmenity = await deleteAmenityById(id);

    if (!deletedAmenity) {
      return res.status(404).json({ message: `Amenity with ID ${id} not found.` });
    }

    res.status(200).json({
      message: `Amenity with ID ${id} successfully deleted`,
      amenity: deletedAmenity,
    });
  } catch (error) {
    console.error('Error deleting amenity:', error.message);
    next(error);
  }
});

export default amenitiesRouter;
