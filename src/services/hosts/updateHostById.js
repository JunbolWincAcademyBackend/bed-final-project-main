import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Function to update a host by their ID.
 * @param {string} id - The ID of the host to update.
 * @param {object} updatedFields - The fields to update (e.g., { name: "New Name", email: "new@example.com" }).
 * @returns {object|null} - Returns the updated host or null if not found.
 */
const updateHostById = async (id, updatedFields) => {
  try {
    // ✅ Define allowed fields for updates
    const allowedFields = ["username", "name", "password", "email", "phoneNumber", "profilePicture", "aboutMe"];
    
    // ✅ Filter out invalid fields
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    // ✅ Prevent empty update (if no valid fields are passed)
    if (Object.keys(filteredFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    // ✅ Check if the host exists
    const existingHost = await prisma.host.findUnique({
      where: { id },
    });

    if (!existingHost) {
      console.warn(`⚠️ Host with ID ${id} not found.`);
      return null; // Return null if host does not exist
    }

    // ✅ Update the host
    const updatedHost = await prisma.host.update({
      where: { id },
      data: filteredFields, // Apply only allowed updates
    });

    console.log(`✅ Host with ID ${id} successfully updated:`, updatedHost);
    return updatedHost; // Return the updated host
  } catch (error) {
    // ✅ Handle unique constraint error (email or username already exists)
    if (error.code === 'P2002') {
      throw new Error(`A host with this ${error.meta.target} already exists.`);
    }

    console.error(`❌ Error updating host with ID ${id}:`, error.message);
    throw new Error('Failed to update host.');
  }
};

export default updateHostById;

