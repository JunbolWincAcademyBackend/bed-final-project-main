import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation
import { userSchema } from '../utils/validationSchemas.js'; // ✅ Import validation schema

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new user in the database
const createUser = async (username, name, password, email, phoneNumber, profilePicture) => {
  try {
    // ✅ Validate input data using the schema
    const { error } = userSchema.validate({ username, password, name, email, phoneNumber, profilePicture });
    if (error) {
      throw new Error(error.details[0].message); // ✅ Throw validation error
    }

    // Create a new user using Prisma's create method
    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(), // ✅ Generate a unique ID for the user
        username, // The username for the new user
        name, // Full name of the user
        password, // Password for authentication (hashed in production)
        email, // Email address of the user
        phoneNumber, // Contact number
        profilePicture, // Optional profile picture URL
      },
    });

    console.log('New user created successfully:', newUser); // Debug log
    return newUser; // Return the newly created user
  } catch (error) {
    console.error('Error creating new user in database:', error.message); // Log any errors
    throw new Error('Failed to create new user.'); // Throw an error for upstream handling
  }
};

export default createUser;
