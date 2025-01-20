import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to update a property by its ID
const updatePropertyById = async (id, updatedFields) => {
  try {
    // Extract amenityIds separately if provided
    const { amenityIds, ...propertyFields } = updatedFields;

    // Update the property with the provided fields and optionally update amenities
    const updatedProperty = await prisma.property.update({
      where: { id }, // Identify the property to update by ID
      data: {
        ...propertyFields, // Update standard fields like title, description, etc.
        amenities: amenityIds
          ? {
              set: amenityIds.map((amenityId) => ({ id: amenityId })), // Update amenities if provided
            }
          : undefined, // Skip updating amenities if not provided
      },
    });

    console.log(`Property with ID ${id} updated:`, updatedProperty);
    return updatedProperty;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`Property with ID ${id} not found.`);
      return null;
    }
    console.error('Error updating property:', error.message);
    throw new Error('Failed to update the property.');
  }
};

export default updatePropertyById;
