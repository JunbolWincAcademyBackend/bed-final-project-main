import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new property in the database
const createProperty = async (propertyData) => {
  try {
    // Destructure the propertyData object for clarity
    const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, amenityIds } = propertyData;

    // Create a new property and associate it with the given amenities
    const newProperty = await prisma.property.create({
      data: {
        id: uuidv4(),         // ✅ Generate a unique ID for the property
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

    console.log('New property created:', newProperty); // Debug log
    return newProperty; // Return the newly created property
  } catch (error) {
    console.error('Error creating property:', error.message); // Log any errors
    throw new Error('Failed to create the property.'); // Throw a generic error for upstream handling
  }
};

export default createProperty; 
