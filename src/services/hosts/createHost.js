import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { userSchema } from '../../utils/validationSchema.js'; // ✅ Import validation schema

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Function to create a new host in the database.
 * @param {object} userData - The host details (username, name, password, email, phoneNumber, profilePicture).
 * @returns {object} - The newly created host object.
 */
const createHost = async (userData) => {
  try {
    // ✅ Destructure the incoming user data
    const { username, name, password, email, phoneNumber, profilePicture } = userData;

    // ✅ Validate input data using the schema
    const { error } = userSchema.validate({ username, password, name, email, phoneNumber, profilePicture });
    if (error) {
      console.error('❌ Validation Failed:', error.details[0].message);
      
      // ✅ Fix: Ensure validation errors return a 400 status
      const validationError = new Error(`Validation Error: ${error.details[0].message}`);
      validationError.statusCode = 400; // 🔥 Fix: Assigns statusCode so Express recognizes it as a 400
      throw validationError;
    }

    // ✅ Create a new host using Prisma's create method
    const newHost = await prisma.user.create({
      data: {
        username,         // The username for the new host
        name,             // Full name of the host
        password,         // Password for authentication (hashed in production)
        email,            // Email address of the host
        phoneNumber,      // Contact number
        profilePicture,   // Optional profile picture URL
      },
    });

    console.log('✅ New host created successfully:', newHost); // Debug log
    return newHost; // Return the newly created host
  } catch (error) {
    // 🚩 Handle Unique Constraint Error (e.g., email or username already exists)
    if (error.code === 'P2002') {
      console.error('⚠️ Duplicate Entry Error:', error.meta.target);
      
      // ✅ Fix: Return 400 instead of generic 500 error
      const duplicateError = new Error(`A user with this ${error.meta.target} already exists.`);
      duplicateError.statusCode = 400; // 🔥 Fix: Ensures duplicate errors return 400
      throw duplicateError;
    }

    console.error('❌ Error creating new host:', error.message); // Log any errors
    
    // ✅ Fix: Ensure unexpected errors return 500 properly
    if (!error.statusCode) error.statusCode = 500; 
    throw error;
  }
};

export default createHost;
