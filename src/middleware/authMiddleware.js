import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config(); // ✅ Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided!' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from Bearer header

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token!' });
  }
};

export default authMiddleware;
