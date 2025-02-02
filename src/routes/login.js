import { Router } from 'express';
import jwt from 'jsonwebtoken'; // ✅ Import JWT for token generation
import dotenv from 'dotenv';


dotenv.config(); // ✅ Load environment variables

const router = Router();

// ✅ Secret key for JWT signing (should be stored in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key'; // Replace with a strong secret key in production

// ✅ Mock user database (replace this with actual DB queries)
const users = [
  { id: 1, username: 'jdoe', password: 'password123', role: 'user' },
  { id: 2, username: 'admin', password: 'adminpass', role: 'admin' },
];

// ✅ GET route to display login instructions
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the login route! To log in, send a POST request with "username" and "password" in the body.',
  });
});

// ✅ POST route for login using JWT authentication
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  console.log('Attempting login for user:', username); // Debugging log

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  // ✅ Validate user credentials
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    console.log('Login failed: Invalid credentials');
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  // ✅ Generate a JWT token for the authenticated user
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role }, // ✅ Included User Info: user details for authentication
    JWT_SECRET, // ✅ Secret key
    { expiresIn: '48h' } // ✅ Token expiration time
  );

  console.log('Login successful for user:', username); // Debugging log
  console.log('Generated JWT Token:', token); // Debugging log

  // ✅ Respond with the generated JWT token
  return res.status(200).json({
    message: 'Successfully logged in!',
    token: token,
  });
});

export default router;
