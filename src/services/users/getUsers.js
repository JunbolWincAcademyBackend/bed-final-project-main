// ✅ Function to retrieve all users
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves all users from the database.
 *
 * How This Works:
 * - Prisma's `findMany` method queries all users in the `User` table.
 * - The returned data includes all fields from the User model in the database.
 * - Efficient database querying avoids manual file imports or in-memory operations.
 *
 * @throws Error if fetching users from the database fails.
 */
const getUsers = async () => {
  try {
    // Use Prisma's findMany method to fetch all users
    const users = await prisma.user.findMany(); // Retrieves all user records from the database

    console.log('Fetched users:', users); // Debug log for verification
    return users; // Return the array of users
  } catch (error) {
    console.error('Error fetching users from database:', error.message); // Log detailed error
    throw new Error('Failed to fetch users.'); // Throw error for upstream handling
  }
};

export default getUsers;
