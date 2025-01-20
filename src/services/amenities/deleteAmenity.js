import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Deletes an amenity by its ID.
 * @param {string} id - The ID of the amenity to delete.
 */
const deleteAmenityById = async (id) => {
  try {
    // Delete the amenity by ID
    const deletedAmenity = await prisma.amenity.delete({
      where: { id },
    });

    console.log(`Amenity with ID ${id} deleted.`);
    return deletedAmenity;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`Amenity with ID ${id} not found.`);
      return null;
    }
    console.error('Error deleting amenity:', error.message);
    throw new Error('Failed to delete the amenity.');
  }
};

export default deleteAmenityById;
