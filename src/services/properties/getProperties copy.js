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

    // 🚩 Fix: Add validation for filters to avoid unnecessary queries
    const validPrice = pricePerNight && !isNaN(parseFloat(pricePerNight)); // Validate price input
    const validAmenities = amenities && amenities.trim(); // Ensure amenities string is non-empty

    // 🚩 Fix: Add a log for incoming filters to debug unexpected inputs
    console.log('Filters received:', { location, pricePerNight, amenities });

    // Fetch properties with dynamically applied filter parameters ✅
    const properties = await prisma.property.findMany({
      where: {
        ...(location && { location: location }), // Apply location filter if provided
        ...(validPrice && { pricePerNight: parseFloat(pricePerNight) }), // 🚩 Ensure price filter is valid before applying
        ...(validAmenities && {
          amenities: {
            some: { name: { in: amenities.split(',').map((a) => a.trim()) } }, // 🚩 Trim amenities before filtering
          },
        }),
      },
      include: {
        amenities: true, // Include associated amenities
        reviews: true, // Include related reviews
        host: true, // Include the host information
      },
    });

    // 🚩 Fix: Add a log to verify the fetched properties
    console.log('Properties fetched:', properties);

    // Return the list of properties matching the filters
    return properties;
  } catch (error) {
    // 🚩 Log the full error object for better debugging
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties.'); // Throw an error for upstream handling
  }
};

export default getProperties;
