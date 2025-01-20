import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to fetch a specific property by its ID
const getPropertyById = async (id) => {
  try {
    // Fetch the property by ID and include related data
    const property = await prisma.property.findUnique({
      where: { id }, // Search for a property with the matching ID
      include: {
        amenities: true, // Include related amenities
        reviews: true,   // Include associated reviews
        host: true,      // Include host details
      },
    });

    // If no property is found, log a warning and return null
    if (!property) {
      console.warn(`Property with ID ${id} not found.`);
      return null;
    }

    return property;
  } catch (error) {
    console.error('Error fetching property by ID:', error.message);
    throw new Error('Failed to fetch the property by ID.');
  }
};

export default getPropertyById;
