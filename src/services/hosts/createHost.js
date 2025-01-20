import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to create a new host
const createHost = async (username, name, password, email, phoneNumber, profilePicture, aboutMe) => {
  try {
    // Create a new host object in the database
    const newHost = await prisma.host.create({
      data: { username, name, password, email, phoneNumber, profilePicture, aboutMe }, // Inserted fields
    });

    console.log('New host created:', newHost); // Debug log
    return newHost; // Return the newly created host
  } catch (error) {
    console.error('Error creating host:', error.message); // Log any errors
    throw new Error('Failed to create host.'); // Throw an error for upstream handling
  }
};

export default createHost;
