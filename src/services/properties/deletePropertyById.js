import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to delete a property by its ID
const deletePropertyById = async (id) => {
  try {
    // Delete the property with the specified ID
    const deletedProperty = await prisma.property.delete({
      where: { id },
    });

    console.log(`Property with ID ${id} deleted.`);
    return deletedProperty;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`Property with ID ${id} not found.`);
      return null;
    }
    console.error('Error deleting property:', error.message);
    throw new Error('Failed to delete the property.');
  }
};

export default deletePropertyById;
