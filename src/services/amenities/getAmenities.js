import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches all amenities from the database.
 */
const getAmenities = async () => {
  try {
    // Fetch all amenities from the database
    const amenities = await prisma.amenity.findMany();
    return amenities;
  } catch (error) {
    console.error('Error fetching amenities:', error.message);
    throw new Error('Failed to fetch amenities.');
  }
};

export default getAmenities;
