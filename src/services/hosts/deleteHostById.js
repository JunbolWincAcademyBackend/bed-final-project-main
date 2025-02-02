import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to delete a host by their ID
const deleteHostById = async (id) => {
  try {
    // Log the ID being passed to the function
    console.log(`Attempting to delete host with ID: ${id}`);

    // Check if the host exists in the database
    const existingHost = await prisma.host.findUnique({
      where: { id }, // Look up the host by ID
    });

    if (!existingHost) {
      console.warn(`Host with ID ${id} not found.`); // Debug log if no host is found
      return null; // Return null if no host is found
    }

    // Log the found host
    console.log(`Host found: ${JSON.stringify(existingHost)}`);

    // Delete the host from the database
    const deletedHost = await prisma.host.delete({
      where: { id }, // Specify the host to delete by ID
    });

    // Log the deleted host
    console.log(`Host with ID ${id} successfully deleted:`, deletedHost); // Debug log for successful delete
    return deletedHost; // Return the deleted host object
  } catch (error) {
    // Log the error details
    console.error(`Error deleting host with ID ${id}:`, error.message); // Log any errors
    throw new Error('Failed to delete host.'); // Throw an error for upstream handling
  }
};

export default deleteHostById;
