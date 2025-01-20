import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new user in the database
const createUser = async (username, name, password, email, phoneNumber, profilePicture) => {
  try {
    // Create a new user using Prisma's create method
    const newUser = await prisma.user.create({
      data: {
        username,       // The username for the new user
        name,           // Full name of the user
        password,       // Password for authentication (hashed in production)
        email,          // Email address of the user
        phoneNumber,    // Contact number
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
