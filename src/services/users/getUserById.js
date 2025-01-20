// ✅ Function to retrieve a user by their ID
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves a user from the database by their unique ID.
 *
 * How This Works:
 * - The `findUnique` method queries the User table for a specific record based on the provided ID.
 * - The `where` clause ensures that only the user with the matching ID is returned.
 * - If no matching user is found, `findUnique` returns `null`.
 *
 * {string} id - The unique identifier of the user.
 * throws Error if fetching the user fails.
 */
const getUserById = async (id) => {
  try {
    // Use Prisma's findUnique method to fetch a user by their ID
    const user = await prisma.user.findUnique({
      where: { id }, // Match the ID field in the User table
    });

    // Log for debugging
    if (!user) {
      console.warn(`User with ID ${id} not found.`); // Log warning if no user is found
    }

    return user; // Return the user object or null if not found
  } catch (error) {
    console.error('Error fetching user by ID from database:', error.message); // Log detailed error
    throw new Error('Failed to fetch the user by ID.'); // Throw error for upstream handling
  }
};

export default getUserById;
