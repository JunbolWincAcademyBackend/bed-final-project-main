import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation
import { userSchema } from '../utils/validationSchemas.js'; // ✅ Import validation schema

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new host
const createHost = async (username, name, password, email, phoneNumber, profilePicture, aboutMe) => {
  try {
    // ✅ Validate input data using the schema
    const { error } = userSchema.validate({ username, password, name, email, phoneNumber, profilePicture });
    if (error) {
      throw new Error(error.details[0].message); // ✅ Throw validation error
    }

    // Create a new host object in the database
    const newHost = await prisma.host.create({
      data: {
        id: uuidv4(), // ✅ Generate a unique ID for the host
        username, // The username for the new host
        name, // Full name of the host
        password, // Password for authentication (hashed in production)
        email, // Email address of the host
        phoneNumber, // Contact number
        profilePicture, // Optional profile picture URL
        aboutMe, // About the host description
      },
    });

    console.log('New host created:', newHost); // Debug log
    return newHost; // Return the newly created host
  } catch (error) {
    console.error('Error creating host:', error.message); // Log any errors
    throw new Error('Failed to create host.'); // Throw an error for upstream handling
  }
};

export default createHost;
