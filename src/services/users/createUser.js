import { PrismaClient } from '@prisma/client';
import { userSchema } from '../../utils/validationSchema.js';

const prisma = new PrismaClient();

/**
 * Creates a new user in the database
 * @param {string} username - The unique username of the user
 * @param {string} name - The full name of the user
 * @param {string} password - The user's password (should be hashed in production)
 * @param {string} email - The email address of the user
 * @param {string} phoneNumber - The user's contact number
 * @param {string} [profilePicture] - Optional profile picture URL
 * @param {string} [role="user"] - User role (default is "user")
 * @returns {Promise<Object>} - The newly created user object
 */
const createUser = async (username, name, password, email, phoneNumber, profilePicture, role = 'user') => {
  try {
    // 🚀 Log incoming request data before validation
    console.log('📥 Incoming user data:', { username, name, password, email, phoneNumber, profilePicture, role });

    // ✅ Ensure required fields are present
    if (!username || !password || !email || !name || !phoneNumber) {
      // 🛠 Construct an error message dynamically
      const missingFields = [];
      if (!username) missingFields.push('username');
      if (!password) missingFields.push('password');
      if (!email) missingFields.push('email');
      if (!name) missingFields.push('name');
      if (!phoneNumber) missingFields.push('phoneNumber');

      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);

      // ✅ Throw a proper validation error with `statusCode = 400`
      const validationError = new Error(errorMessage);
      validationError.statusCode = 400; // 🔥 Fix: Ensures the error is handled correctly in errorHandler.js
      throw validationError;
    }

    // ✅ Log before validating with Joi
    console.log('🔍 Validating data with Joi:', { username, password, name, email, phoneNumber, profilePicture, role });

    // ✅ Validate input using Joi schema (role is optional and handled by Prisma)
    const { error, value } = userSchema.validate({
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
    });

    if (error) {
      console.error('❌ Validation failed:', error.details[0].message);
      const joiError = new Error(`Validation error: ${error.details[0].message}`);
      joiError.statusCode = 400; // 🔥 Fix: Ensure Joi validation errors return 400
      throw joiError;
    }

    // 🚀 Log the cleaned and validated data
    console.log('✅ Validated data (after Joi processing):', value);

    // ✅ Check if user already exists (check email, username, and phoneNumber)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: value.email }, { username: value.username }, { phoneNumber: value.phoneNumber }],
      },
    });

    if (existingUser) {
      const duplicateError = new Error('A user with this email, username, or phone number already exists.');
      duplicateError.statusCode = 400; // 🔥 Fix: Ensures duplicate user errors return 400 instead of 500
      throw duplicateError;
    }

    // 🚀 Proceed to create new user in the database
    const newUser = await prisma.user.create({
      data: {
        username: value.username,
        name: value.name,
        password: value.password, // Make sure to hash this in production
        email: value.email,
        phoneNumber: value.phoneNumber,
        profilePicture: value.profilePicture || null, // Ensure null if not provided
        role: value.role, // Prisma handles the default value if not passed
      },
    });

    console.log('✅ New user created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    if (!error.statusCode) error.statusCode = 500; // 🔥 Fix: Ensures unexpected errors return 500
    throw error;
  }
};

export default createUser;
