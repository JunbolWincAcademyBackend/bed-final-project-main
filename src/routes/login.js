import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; // ✅ Import Prisma

dotenv.config();
const router = Router();
const prisma = new PrismaClient(); // ✅ Initialize Prisma Client

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key'; // ✅ Load secret key

// ✅ GET route for login instructions
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the login route! To log in, send a POST request with "username" and "password" in the body.',
  });
});

// ✅ POST route for login using database users
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  console.log('Attempting login for user:', username);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  // ✅ Fetch user from database instead of using hardcoded users
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user || user.password !== password) {
    console.log('Login failed: Invalid credentials');
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  // ✅ Generate a JWT token for the authenticated user
  const token = jwt.sign(
    { id: user.id, username: user.username}, // ✅ Includes actual DB user info
    JWT_SECRET,
    { expiresIn: '48h' }
  );

  console.log('Login successful for user:', username);
  console.log('Generated JWT Token:', token);

  // ✅ Respond with the generated JWT token
  return res.status(200).json({
    message: 'Successfully logged in!',
    token: token, // ✅ Return only the token (not "Bearer <token>")
  });
});

export default router;
