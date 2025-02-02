import Joi from 'joi';

// ✅ Define the validation schema
export const userSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 3 characters long.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
  }),

  name: Joi.string().min(2).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 2 characters long.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^(\+?[0-9\s-]{7,15})$/) // Allows +1234567890 OR 123-456-7890
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a valid format (e.g., +1234567890 or 123-456-7890).',
    }),
  profilePicture: Joi.string()
    .uri({ scheme: ['http', 'https'] }) // ✅ Ensures it's a valid URL
    .pattern(/\.(jpg|png)$/i) // ✅ Allows both ".jpg" and ".png" (case insensitive)
    .required()
    .messages({
      'string.empty': 'Profile picture URL is required.',
      'string.uri': 'Profile picture must be a valid URL.',
      'string.pattern.base': 'Profile picture must be a .jpg or .png file.',
    }),
});
