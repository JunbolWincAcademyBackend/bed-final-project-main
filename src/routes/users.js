import express from 'express'; // Import Express for creating routes
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

// ✅ Import the services
import getUsers from '../services/users/getUsers.js'; // Import getUsers service
import getUserById from '../services/users/getUserById.js'; // Import getUserById service
import createUser from '../services/users/createUser.js'; // Import createUser service
import updateUserById from '../services/users/updateUserById.js'; // Import updateUserById service
import deleteUserById from '../services/users/deleteUserById.js'; // Import deleteUserById service

const usersRouter = express.Router(); // Create a router for users

// **Route to fetch all users with optional query parameters**
usersRouter.get('/', async (req, res, next) => {
  try {
    const { username, email } = req.query; // Extract query parameters
    const users = await getUsers({ username, email }); // Fetch users via service
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    next(error);
  }
});

// **Route to fetch a user by ID**
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id); // Fetch user via service

    if (!user) throw new NotFoundError('User', id);
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error fetching user by ID:', error.message);
    next(error);
  }
});

// **Route to create a new user**
usersRouter.post('/', async (req, res, next) => {
  try {
    // 🚀 Log incoming request body
    console.log('📥 Incoming request body:', req.body);

    const { username, password, name, email, phoneNumber, profilePicture, role } = req.body;

    // ✅ Log extracted user data
    console.log('🛠 Extracted user data:', { username, password, name, email, phoneNumber, profilePicture, role });

    // ✅ Pass request data to createUser function
    const newUser = await createUser(username, password, name, email, phoneNumber, profilePicture, role);

    res.status(201).json({
      message: '✅ User created successfully!',
      user: newUser,
    });
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    next(error);
  }
});

// **Route to update a user by ID**
usersRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedUser = await updateUserById(id, updatedFields);

    if (!updatedUser) throw new NotFoundError('User', id);

    res.status(200).json({
      message: `✅ User with ID ${id} successfully updated`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
    next(error);
  }
});

// **Route to delete a user by ID**
usersRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) throw new NotFoundError('User', id);

    res.status(200).json({
      message: `✅ User with ID ${id} successfully deleted`,
      user: deletedUser,
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
    next(error);
  }
});

export default usersRouter;
