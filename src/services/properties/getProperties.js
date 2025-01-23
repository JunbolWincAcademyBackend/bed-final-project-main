// UPDATED VERSION TO HANDLE QUERY PARAMETERS PASSED AS FILTERS: 
// This function is designed to accept query parameters (like location, pricePerNight, and amenities) as filters.
// The query parameters are passed from the API endpoint (e.g., properties.js) and applied dynamically to fetch matching properties.

import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch properties based on optional filters passed as query parameters
const getProperties = async (filters) => {
  try {
    // Destructure filters for clarity
    const { location, pricePerNight, amenities } = filters; // Query parameters expected to be passed here ✅

    // Fetch properties with dynamically applied filter parameters ✅
    const properties = await prisma.property.findMany({
      where: {
        // ✅ Dynamically applied filters
        ...(location && { location: location }), // Apply location filter if provided
        ...(pricePerNight && { pricePerNight: parseFloat(pricePerNight) }), // Apply price filter if provided
        ...(amenities && {
          amenities: {
            some: { name: { in: amenities.split(',') } }, // Apply amenities filter (comma-separated)
          },
        }),
      },
      include: {
        amenities: true, // Include associated amenities
        reviews: true,   // Include related reviews
        host: true,      // Include the host information
      },
    });

    // Return the list of properties matching the filters
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error.message); // Log errors for debugging
    throw new Error('Failed to fetch properties.'); // Throw an error for upstream handling
  }
};

export default getProperties;





/* 
ORIGINAL VERSION WITHOUT QUERIES AND FILTERING:

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

export default getProperties; */
