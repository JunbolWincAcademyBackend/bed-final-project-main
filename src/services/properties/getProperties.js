import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to fetch all properties from the database
const getProperties = async () => {
  try {
    // Fetch all properties with their related amenities, reviews, and host details
    const properties = await prisma.property.findMany({
      include: {
        amenities: true, // Include associated amenities
        reviews: true,   // Include related reviews
        host: true,      // Include the host information
      },
    });

    // Return the list of properties
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    throw new Error('Failed to fetch properties.');
  }
};

export default getProperties;
