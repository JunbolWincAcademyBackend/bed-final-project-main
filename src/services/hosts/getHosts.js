import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to fetch all hosts from the database with optional filters
const getHosts = async (filters) => {
  try {
    // Destructure filters for clarity
    const { name, email } = filters;
    console.log('log1 Filters applied:', { name, email });

    // Fetch hosts with applied conditional filters based on those received in query parameters ✅
    const hosts = await prisma.host.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(name && { name: { equals: name } }), // Filter by name
        ...(email && { email: { contains: email } }), // Filter by email
      },
    });
    console.log('log2 Filters applied:', { name, email });

    // Return the list of filtered hosts
    return hosts;
  } catch (error) {
    console.error('Error fetching hosts:', error.message);
    throw new Error('Failed to fetch hosts.');
  }
};

export default getHosts;
