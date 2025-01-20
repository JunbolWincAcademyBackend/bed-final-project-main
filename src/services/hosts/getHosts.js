import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to get all hosts
const getHosts = async () => {
  try {
    // Fetch all hosts from the database
    const hosts = await prisma.host.findMany(); // Retrieves all hosts as an array
    console.log('Fetched all hosts:', hosts); // Debug log
    return hosts; // Return the fetched hosts
  } catch (error) {
    console.error('Error fetching hosts:', error.message); // Log any errors
    throw new Error('Failed to fetch hosts.'); // Throw an error for upstream handling
  }
};

export default getHosts;
