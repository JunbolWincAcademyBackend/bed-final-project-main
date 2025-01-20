import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to delete a user by their ID
const deleteUserById = async (id) => {
  try {
    // Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id }, // Look up the user by ID
    });

    if (!existingUser) {
      console.warn(`User with ID ${id} not found.`); // Debug log if user not found
      return null; // Return null if no user exists with the given ID
    }

    // Delete the user from the database
    const deletedUser = await prisma.user.delete({
      where: { id }, // Specify the user to delete by ID
    });

    console.log(`User with ID ${id} successfully deleted:`, deletedUser); // Debug log
    return deletedUser; // Return the deleted user object
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error.message); // Log any errors
    throw new Error('Failed to delete user.'); // Throw an error for upstream handling
  }
};

export default deleteUserById;
