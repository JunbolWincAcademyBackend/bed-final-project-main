import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch all hosts from the database with optional filters
const getHosts = async (filters) => {
  try {
    // Destructure filters for clarity
    const { name, email } = filters;

    // Fetch hosts with applied conditional filters ✅
    const hosts = await prisma.host.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(name && { name: { contains: name, mode: 'insensitive' } }), // Filter by name (case-insensitive search)
        ...(email && { email: { contains: email, mode: 'insensitive' } }), // Filter by email (case-insensitive search)
      },
    });

    // Return the list of filtered hosts
    return hosts;
  } catch (error) {
    console.error('Error fetching hosts:', error.message);
    throw new Error('Failed to fetch hosts.');
  }
};

export default getHosts;

