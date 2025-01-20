import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates a new amenity in the database.
 * @param {string} name - The name of the new amenity.
 */
const createAmenity = async (name) => {
  try {
    // Create a new amenity
    const newAmenity = await prisma.amenity.create({
      data: { name },
    });

    console.log('New amenity created:', newAmenity);
    return newAmenity;
  } catch (error) {
    console.error('Error creating amenity:', error.message);
    throw new Error('Failed to create the amenity.');
  }
};

export default createAmenity;
