
import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch all amenities from the database with optional filters
const getAmenities = async (filters) => {
  try {
    // Destructure filters for clarity
    const { name } = filters;

    // Fetch amenities with applied conditional filters ✅
    const amenities = await prisma.amenity.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(name && { name: { contains: name, mode: 'insensitive' } }), // Filter by name (case-insensitive search)
      },
    });

    // Return the list of filtered amenities
    return amenities;
  } catch (error) {
    console.error('Error fetching amenities:', error.message);
    throw new Error('Failed to fetch amenities.');
  }
};

export default getAmenities;


/* import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


 * Fetches all amenities from the database.

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

export default getAmenities; */
