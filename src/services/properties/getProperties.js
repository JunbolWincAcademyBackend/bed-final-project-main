import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch properties based on optional filters passed as query parameters
const getProperties = async (filters) => {
  try {
    // Destructure filters for clarity
    const { location, pricePerNight, amenities } = filters; // Query parameters expected to be passed here ✅

    // 🚩 Debug: Log incoming filters
    console.log('Filters received:', { location, pricePerNight, amenities });

    // 🚩 Fix: Validate and sanitize filters
    const validPrice = pricePerNight && !isNaN(parseFloat(pricePerNight));
    const validAmenities = amenities && amenities.trim();

    // 🚩 Debug: Log sanitized filters
    console.log('Sanitized Filters:', { location, validPrice, validAmenities });

    // Fetch properties with dynamically applied filter parameters ✅
    const properties = await prisma.property.findMany({
      where: {
        ...(location && { location }), // Apply location filter if provided
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

    // 🚩 Debug: Log fetched properties
    console.log('Properties fetched:', properties);

    // Return the list of properties matching the filters
    return properties;
  } catch (error) {
    // 🚩 Debug: Log the entire error for better debugging
    console.error('Error fetching properties:', error);

    // 🚩 Improve error message with detailed context
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }
};

export default getProperties;
