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
      throw new Error('Missing required fields: username, password, email, name, or phoneNumber.');
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
      throw new Error(`Validation error: ${error.details[0].message}`);
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
      throw new Error('A user with this email, username, or phone number already exists.');
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
    throw new Error(`Failed to create new user: ${error.message}`);
  }
};

export default createUser;
