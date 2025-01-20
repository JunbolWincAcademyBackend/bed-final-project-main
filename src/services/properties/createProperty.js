import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to create a new property in the database
const createProperty = async (propertyData) => {
  try {
    // Destructure the propertyData object for clarity
    const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, amenityIds } = propertyData;

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
        amenities: {
          connect: amenityIds.map((id) => ({ id })), // Link amenities by their IDs
        },
      },
    });

    console.log('New property created:', newProperty);
    return newProperty;
  } catch (error) {
    console.error('Error creating property:', error.message);
    throw new Error('Failed to create the property.');
  }
};

export default createProperty;
