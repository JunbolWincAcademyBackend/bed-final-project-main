import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Updates an amenity by its ID.
 * @param {string} id - The ID of the amenity to update.
 * @param {object} updatedFields - The fields to update (e.g., { name: "New Amenity Name" }).
 */
const updateAmenityById = async (id, updatedFields) => {
  try {
    // ✅ Validate that only allowed fields are updated
    const allowedFields = ["name"]; // 🚩 Define allowed fields
    const filteredFields = Object.keys(updatedFields)// Gets an array of all keys (field names) in updatedFields.
      .filter(key => allowedFields.includes(key)) // 🚩 Keep only valid fields
      .reduce((obj, key) => {//using reduce to reduces the array of all keys into a single object iterating through the filtered fields in .filter() above
        obj[key] = updatedFields[key]; // 🚩 Construct filtered update object
        return obj;
      }, {});// 🚩 {} is the initial empty object
    

    if (Object.keys(filteredFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    // ✅ Update the amenity with the filtered fields
    const updatedAmenity = await prisma.amenity.update({
      where: { id },
      data: filteredFields,
    });

    console.log(`✅ Amenity with ID ${id} updated:`, updatedAmenity);
    return updatedAmenity;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`⚠️ Amenity with ID ${id} not found.`);
      return null;
    }
    console.error('❌ Error updating amenity:', error.message);
    throw new Error('Failed to update the amenity.');
  }
};

export default updateAmenityById;

