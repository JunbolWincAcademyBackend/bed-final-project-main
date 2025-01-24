import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch all users from the database with optional filters
const getUsers = async (filters) => {
  try {
    // Destructure filters for clarity
    const { username, email } = filters;

    // Fetch users with applied conditional filters ✅
    const users = await prisma.user.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(username && { username }), // Filter by username
        ...(email && { email }), // Filter by email
      },
      include: {
        bookings: true, // Include associated bookings
        reviews: true, // Include associated reviews
      },
    });

    // Return the list of filtered users
    return users;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw new Error('Failed to fetch users.');
  }
};

export default getUsers;

/* // ✅ Function to retrieve all users
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


 * Retrieves all users from the database.
 *
 * How This Works:
 * - Prisma's `findMany` method queries all users in the `User` table.
 * - The returned data includes all fields from the User model in the database.
 * - Efficient database querying avoids manual file imports or in-memory operations.
 *
 * throws Error if fetching users from the database fails.

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

export default getUsers; */
