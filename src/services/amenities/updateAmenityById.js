import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Updates an amenity by its ID.
 * @param {string} id - The ID of the amenity to update.
 * @param {object} updatedFields - The fields to update (e.g., { name: "New Amenity Name" }).
 */
const updateAmenityById = async (id, updatedFields) => {
  try {
    // Update the amenity with the provided fields
    const updatedAmenity = await prisma.amenity.update({
      where: { id },
      data: updatedFields,
    });

    console.log(`Amenity with ID ${id} updated:`, updatedAmenity);
    return updatedAmenity;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`Amenity with ID ${id} not found.`);
      return null;
    }
    console.error('Error updating amenity:', error.message);
    throw new Error('Failed to update the amenity.');
  }
};

export default updateAmenityById;
