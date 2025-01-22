import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches a specific amenity by its ID.
 * param {string} id - The ID of the amenity to fetch.
 */
const getAmenityById = async (id) => {
  try {
    // Fetch a single amenity by ID
    const amenity = await prisma.amenity.findUnique({
      where: { id },
    });

    // If no amenity is found, return null
    if (!amenity) {
      console.warn(`Amenity with ID ${id} not found.`);
      return null;
    }

    return amenity;
  } catch (error) {
    console.error('Error fetching amenity by ID:', error.message);
    throw new Error('Failed to fetch the amenity by ID.');
  }
};

export default getAmenityById;
