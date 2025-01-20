import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to get a host by their ID
const getHostById = async (id) => {
  try {
    // Fetch the host with the matching ID
    const host = await prisma.host.findUnique({
      where: { id }, // Look up the host by ID
    });

    if (!host) {
      console.warn(`Host with ID ${id} not found.`); // Debug log
      return null; // Return null if no host is found
    }

    console.log('Fetched host:', host); // Debug log
    return host; // Return the fetched host
  } catch (error) {
    console.error(`Error fetching host with ID ${id}:`, error.message); // Log any errors
    throw new Error('Failed to fetch the host.'); // Throw an error for upstream handling
  }
};

export default getHostById;
