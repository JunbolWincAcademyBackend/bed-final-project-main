import express from 'express'; // Import Express for creating routes
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

// ✅ Import service functions from the services folder
import getHosts from '../services/hosts/getHosts.js';
import getHostById from '../services/hosts/getHostById.js';
import createHost from '../services/hosts/createHost.js';
import updateHostById from '../services/hosts/updateHostById.js';
import deleteHostById from '../services/hosts/deleteHostById.js';

const hostsRouter = express.Router(); // Create a router for hosts

// **Route to fetch all hosts with optional query parameters**
hostsRouter.get('/', async (req, res, next) => {
  try {
    const { name, email } = req.query; // Extract query parameters
    console.log('Query Parameters in Route:', { name, email }); // ✅ Debug log

    const hosts = await getHosts({ name, email });
    console.log(hosts); // ✅ Debug log

    res.status(200).json(hosts);
  } catch (error) {
    console.error('Error fetching hosts:', error.message);
    next(error);
  }
});

// **Route to fetch a host by ID**
hostsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await getHostById(id);
    if (!host) throw new NotFoundError('Host', id);

    res.status(200).json(host);
  } catch (error) {
    console.error('Error fetching host by ID:', error.message);
    next(error);
  }
});

// **Route to create a new host**
hostsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    const newHost = await createHost({ username, password, name, email, phoneNumber, profilePicture, aboutMe });

    res.status(201).json({
      message: 'Host created successfully!',
      host: newHost,
    });
  } catch (error) {
    console.error('Error creating host:', error.message);
    next(error);
  }
});

// **Route to update a host by ID**
hostsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedHost = await updateHostById(id, updatedFields);
    if (!updatedHost) throw new NotFoundError('Host', id);

    res.status(200).json({
      message: `Host with ID ${id} successfully updated`,
      host: updatedHost,
    });
  } catch (error) {
    console.error('Error updating host:', error.message);
    next(error);
  }
});

// **Route to delete a host by ID**
hostsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedHost = await deleteHostById(id);
    if (!deletedHost) throw new NotFoundError('Host', id);

    res.status(200).json({
      message: `Host with ID ${id} successfully deleted`,
      host: deletedHost,
    });
  } catch (error) {
    console.error('Error deleting host:', error.message);
    next(error);
  }
});

export default hostsRouter;
