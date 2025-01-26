import express from 'express';
import 'dotenv/config'; // ✅ Load environment variables from .env
import { auth } from 'express-oauth2-jwt-bearer'; // ✅ Middleware for JWT validation
import loginRouter from './routes/login.js'; // ✅ Public route (no JWT required)
import usersRouter from './routes/users.js'; // ✅ Users route
import bookingsRouter from './routes/bookings.js'; // ✅ Bookings route
import hostsRouter from './routes/hosts.js'; // ✅ Hosts route
import propertiesRouter from './routes/properties.js'; // ✅ Properties route
import amenitiesRouter from './routes/amenities.js'; // ✅ Properties route
import reviewsRouter from './routes/reviews.js'; // ✅ Reviews route
import errorHandler from './middleware/errorHandler.js'; // ✅ Custom error handler
import logMiddleware from './middleware/logMiddleware.js'; // ✅ Logging middleware

const app = express();
const port = process.env.PORT || 3000; // ✅ Use PORT from .env or default to 3000

//---------------------------
// JWT Middleware Setup
//---------------------------
/*
 * This middleware validates JWT tokens for protected routes.
 * Only users with a valid token can access routes like `/users`, `/bookings`, etc.
 */
/* const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // API audience from Auth0
  issuerBaseURL: process.env.AUTH0_DOMAIN, // Auth0 domain
  tokenSigningAlg: 'RS256', // Algorithm for token validation
}); */

//---------------------------
// Standard Middleware
//---------------------------
app.use(express.json()); // ✅ Parse incoming JSON requests
app.use(logMiddleware); // ✅ Custom logging middleware

//---------------------------
// Public Routes (No JWT Required)
//---------------------------
/* The login route does not require authentication */
app.use('/login', loginRouter);

//---------------------------
// Protected Routes (JWT Required)
//---------------------------
/*
 * These routes are protected by the `jwtCheck` middleware.
 * Users must provide a valid JWT token in the `Authorization` header to access them.
 */

app.use('/users', usersRouter); // ✅ Route for users
app.use('/bookings', bookingsRouter); // ✅ Route for bookings
app.use('/hosts', hostsRouter); // ✅ Route for hosts
app.use('/properties', propertiesRouter); // ✅ Route for properties
app.use('/amenities', amenitiesRouter); // ✅ Route for properties
app.use('/reviews', reviewsRouter); // ✅ Route for reviews

//---------------------------
// Root Route
//---------------------------
/* Example public route (no authentication required) */
app.get('/', (req, res) => {
  res.send('Welcome to the Booking API!'); // ✅ Public message
});

//---------------------------
// Error Handling Middleware
//---------------------------
/* Handles all errors thrown by routes or middleware */
app.use(errorHandler);

/**
 * --- How This API Works ---
 *
 * 1. Public Route:
 *    - `/login`: This route allows users to log in and obtain a JWT token.
 *
 * 2. Protected Routes:
 *    - `/users`, `/bookings`, `/hosts`, `/properties`, `/reviews`:
 *      These routes require users to include their JWT token in the `Authorization` header.
 *      Example: Authorization: Bearer <JWT_TOKEN>
 *
 * 3. JWT Validation:
 *    - The `jwtCheck` middleware validates the JWT token for protected routes.
 *    - If the token is invalid or missing, the user gets a `401 Unauthorized` error.
 *
 * 4. Route Handlers:
 *    - Each route is responsible for handling specific API operations (e.g., CRUD).
 */

//---------------------------
// Start the Server
//---------------------------
/* Start listening for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`); // ✅ Server is live
});

/* Graceful Shutdown */
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
