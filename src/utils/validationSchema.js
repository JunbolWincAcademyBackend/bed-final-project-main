import Joi from 'joi';

// ✅ Define the validation schema
export const userSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 3 characters long.',
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
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
    .pattern(/^\+?[1-9]\d{1,14}$/) // E.164 phone number format
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a valid format.',
    }),
  profilePicture: Joi.string()
    .pattern(/\.jpg$/) // ✅ Ensure the file format is .jpg
    .required()
    .messages({
      'string.empty': 'Profile picture URL is required.',
      'string.pattern.base': 'Profile picture must be a .jpg file.',
    }),
});
