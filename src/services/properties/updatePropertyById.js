import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Updates a property by its ID.
 * @param {string} id - The ID of the property to update.
 * @param {object} updatedFields - The fields to update (e.g., { title: "New Title", pricePerNight: 100 }).
 */
const updatePropertyById = async (id, updatedFields) => {
  try {
    // ✅ Extract amenityIds separately, if provided
    const { amenityIds, ...propertyFields } = updatedFields;

    // ✅ This is make sure at least one valid field is provided for the update
    if (!Object.keys(propertyFields).length && !amenityIds) {
      throw new Error("No valid fields provided for update.");
    }

    // ✅ Update the property with provided fields & amenities
    const updatedProperty = await prisma.property.update({
      where: { id }, // Identify the property by ID
      data: {
        ...propertyFields, // Standard fields (title, description, etc.)
        amenities: amenityIds
          ? { set: amenityIds.map((amenityId) => ({ id: amenityId })) } // Update amenities, if provided
          : undefined, // Skip updating amenities if not provided
      },
    });

    console.log(`✅ Property with ID ${id} successfully updated:`, updatedProperty);
    return updatedProperty;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`⚠️ Property with ID ${id} not found.`);
      return null;
    }
    console.error('❌ Error updating property:', error.message);
    throw new Error('Failed to update the property.');
  }
};

export default updatePropertyById;
