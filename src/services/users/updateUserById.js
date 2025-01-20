import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to update a user by their ID
const updateUserById = async (id, updatedFields) => {
  try {
    // Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id }, // Look up the user by ID
    });

    if (!existingUser) {
      console.warn(`User with ID ${id} not found.`); // Debug log if user not found
      return null; // Return null if no user exists with the given ID
    }

    // Update the user with the new fields
    const updatedUser = await prisma.user.update({
      where: { id },          // Specify the user to update by ID
      data: { ...updatedFields }, // Spread updated fields into the update object
    });

    console.log(`User with ID ${id} successfully updated:`, updatedUser); // Debug log
    return updatedUser; // Return the updated user object
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error.message); // Log any errors
    throw new Error('Failed to update user.'); // Throw an error for upstream handling
  }
};

export default updateUserById;
