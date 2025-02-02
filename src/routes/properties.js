import express from 'express'; // Import Express for creating routes
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

// ✅ Import services from the properties folder
import getProperties from '../services/properties/getProperties.js';
import getPropertyById from '../services/properties/getPropertyById.js';
import createProperty from '../services/properties/createProperty.js';
import updatePropertyById from '../services/properties/updatePropertyById.js';
import deletePropertyById from '../services/properties/deletePropertyById.js';

const propertiesRouter = express.Router(); // Create a router for properties

// **Route to fetch all properties**
propertiesRouter.get('/', async (req, res, next) => {
  try {
    const properties = await getProperties(req.query);
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    next(error);
  }
});

// **Route to fetch a property by ID**
propertiesRouter.get('/:id', async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) throw new NotFoundError('Property', req.params.id);
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error.message);
    next(error);
  }
});

// **Route to create a new property**
propertiesRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const newProperty = await createProperty(req.body);
    res.status(201).json({
      message: 'Property created successfully!',
      property: newProperty,
    });
  } catch (error) {
    console.error('Error creating property:', error.message);
    next(error);
  }
});

// **Route to update a property by ID**
propertiesRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const updatedProperty = await updatePropertyById(req.params.id, req.body);
    if (!updatedProperty) throw new NotFoundError('Property', req.params.id);
    res.status(200).json({
      message: `Property with ID ${req.params.id} successfully updated`,
      property: updatedProperty,
    });
  } catch (error) {
    console.error('Error updating property:', error.message);
    next(error);
  }
});

// **Route to delete a property by ID**
propertiesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const deletedProperty = await deletePropertyById(req.params.id);
    if (!deletedProperty) throw new NotFoundError('Property', req.params.id);
    res.status(200).json({
      message: `Property with ID ${req.params.id} successfully deleted`,
      property: deletedProperty,
    });
  } catch (error) {
    console.error('Error deleting property:', error.message);
    next(error);
  }
});

export default propertiesRouter;
