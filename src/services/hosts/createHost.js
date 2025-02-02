import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { userSchema } from '../../utils/validationSchema.js'; // ✅ Correct path
 // ✅ Import validation schema

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Function to create a new user in the database.
 * @param {object} userData - The user details (username, name, password, email, phoneNumber, profilePicture).
 * @returns {object} - The newly created user object.
 */
const createUser = async (userData) => {
  try {
    // ✅ Destructure the incoming user data
    const { username, name, password, email, phoneNumber, profilePicture } = userData;

    // ✅ Validate input data using the schema
    const { error } = userSchema.validate({ username, password, name, email, phoneNumber, profilePicture });
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`); // ✅ Improved error message
    }

    // ✅ Create a new user using Prisma's create method
    const newUser = await prisma.user.create({
      data: {
        username,         // The username for the new user
        name,             // Full name of the user
        password,         // Password for authentication (hashed in production)
        email,            // Email address of the user
        phoneNumber,      // Contact number
        profilePicture,   // Optional profile picture URL
      },
    });

    console.log('✅ New user created successfully:', newUser); // Debug log
    return newUser; // Return the newly created user
  } catch (error) {
    // 🚩 Handle Unique Constraint Error (e.g., email or username already exists)
    if (error.code === 'P2002') {
      console.error('⚠️ Duplicate Entry Error:', error.meta.target);
      throw new Error(`A user with this ${error.meta.target} already exists.`);
    }

    console.error('❌ Error creating new user:', error.message); // Log any errors
    throw new Error('Failed to create new user.'); // Generic error for security reasons
  }
};

export default createUser;

