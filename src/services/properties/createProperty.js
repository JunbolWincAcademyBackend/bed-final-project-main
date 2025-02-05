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

    // ✅ Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathRoomCount ||
      !maxGuestCount ||
      !hostId
    ) {
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!description) missingFields.push('description');
      if (!location) missingFields.push('location');
      if (!pricePerNight) missingFields.push('pricePerNight');
      if (!bedroomCount) missingFields.push('bedroomCount');
      if (!bathRoomCount) missingFields.push('bathRoomCount');
      if (!maxGuestCount) missingFields.push('maxGuestCount');
      if (!hostId) missingFields.push('hostId');

      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);

      // ✅ Fix: Ensure validation errors return 400
      const validationError = new Error(errorMessage);
      validationError.statusCode = 400;
      throw validationError;
    }

    // ✅ Validate that `amenityIds` is an array before calling `.map()`
    if (!Array.isArray(amenityIds)) {
      const formatError = new Error('Invalid amenities format. It must be an array of IDs.');
      formatError.statusCode = 400; // 🔥 Fix: Ensure 400 error for invalid input
      throw formatError;
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
    console.error('❌ Error creating property:', error.message);

    // ✅ Fix: Assign `statusCode = 400` if it's a validation error
    if (!error.statusCode) error.statusCode = 500;

    throw error;
  }
};

export default createProperty;
