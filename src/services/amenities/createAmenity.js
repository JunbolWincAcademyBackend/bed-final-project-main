import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Creates a new amenity in the database.
 * @param {string} name - The name of the new amenity.
 */
const createAmenity = async (name) => {
  try {
    // Create a new amenity
    const newAmenity = await prisma.amenity.create({
      data: {
        id: uuidv4(), // ✅ Generate a unique ID for the amenity
        name,         // Name of the amenity
      },
    });

    console.log('New amenity created:', newAmenity); // Debug log
    return newAmenity; // Return the newly created amenity
  } catch (error) {
    console.error('Error creating amenity:', error.message); // Log any errors
    throw new Error('Failed to create the amenity.'); // Throw an error for upstream handling
  }
};

export default createAmenity; 
