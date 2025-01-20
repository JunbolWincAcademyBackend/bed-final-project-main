import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to update a host by their ID
const updateHostById = async (id, updatedFields) => {
  try {
    // Check if the host exists in the database
    const existingHost = await prisma.host.findUnique({
      where: { id }, // Look up the host by ID
    });

    if (!existingHost) {
      console.warn(`Host with ID ${id} not found.`); // Debug log
      return null; // Return null if no host is found
    }

    // Update the host with the provided fields
    const updatedHost = await prisma.host.update({
      where: { id }, // Identify the host to update by ID
      data: updatedFields, // Apply the updates
    });

    console.log(`Host with ID ${id} successfully updated:`, updatedHost); // Debug log
    return updatedHost; // Return the updated host
  } catch (error) {
    console.error(`Error updating host with ID ${id}:`, error.message); // Log any errors
    throw new Error('Failed to update host.'); // Throw an error for upstream handling
  }
};

export default updateHostById;
