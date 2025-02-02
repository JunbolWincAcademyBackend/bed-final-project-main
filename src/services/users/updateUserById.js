import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Updates a user by their ID.
 * @param {string} id - The ID of the user to update.
 * @param {object} updatedFields - The fields to update (e.g., { name: "New Name" }).
 * @returns {object|null} - The updated user object or null if not found.
 */
const updateUserById = async (id, updatedFields) => {
  try {
    // ✅ Define allowed fields to update
    const allowedFields = ["username", "name", "password", "email", "phoneNumber", "profilePicture", "role"];
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    if (Object.keys(filteredFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    // ✅ Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      console.warn(`⚠️ User with ID ${id} not found.`);
      return null;
    }

    // ✅ Update the user with only the allowed fields
    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredFields,
    });

    console.log(`✅ User with ID ${id} successfully updated:`, updatedUser);
    return updatedUser;
  } catch (error) {
    // 🚩 Handle Unique Constraint Error (e.g., duplicate email or username)
    if (error.code === "P2002") {
      console.error(`⚠️ Unique constraint error:`, error.meta.target);
      throw new Error(`A user with this ${error.meta.target} already exists.`);
    }

    console.error(`❌ Error updating user with ID ${id}:`, error.message);
    throw new Error("Failed to update user.");
  }
};

export default updateUserById;

