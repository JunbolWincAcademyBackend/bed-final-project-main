import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new property in the database
const createProperty = async (propertyData) => {
  try {
    // Destructure the propertyData object for clarity
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      amenityIds = [], // ✅ Default to an empty array to avoid errors
      rating,
    } = propertyData;

    // ✅ Validate that `amenityIds` is an array before calling `.map()`
    if (!Array.isArray(amenityIds)) {
      throw new Error('Invalid amenities format. It must be an array of IDs.');
    }

    // Create a new property and associate it with the given amenities
    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating, // ✅ Include the rating in the property data
        amenities: {
          connect: amenityIds.map((id) => ({ id })), // Link amenities by their IDs
        },
      },
    });

    console.log('✅ New property created:', newProperty); // Debug log
    return newProperty; // Return the newly created property
  } catch (error) {
    console.error('❌ Error creating property:', error.message); // Log any errors
    throw new Error('Failed to create the property.'); // Throw a generic error for upstream handling
  }
};

export default createProperty;
