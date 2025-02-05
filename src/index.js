import dotenv from 'dotenv';
dotenv.config(); // this is to load environment variables at the start of the app


import './instrument.js'; // ✅ Import the Sentry instrumentation (must be at the top)

import express from 'express'; // ✅ Use modern ESM imports
import 'dotenv/config'; // ✅ Load environment variables from .env
import loginRouter from './routes/login.js';
import usersRouter from './routes/users.js';
import bookingsRouter from './routes/bookings.js';
import hostsRouter from './routes/hosts.js';
import propertiesRouter from './routes/properties.js';
import amenitiesRouter from './routes/amenities.js';
import reviewsRouter from './routes/reviews.js';
import errorHandler from './middleware/errorHandler.js';
import logMiddleware from './middleware/logMiddleware.js';
import * as Sentry from '@sentry/node';

const app = express();

//---------------------------
// Middleware Setup
//---------------------------
app.use(express.json()); // ✅ Parse incoming JSON requests
app.use(logMiddleware); // ✅ Add custom logging middleware

//---------------------------
// Routes
//---------------------------
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/bookings', bookingsRouter);
app.use('/hosts', hostsRouter);
app.use('/properties', propertiesRouter);
app.use('/amenities', amenitiesRouter);
app.use('/reviews', reviewsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Booking API!');
});

// Debug route for testing Sentry
app.get('/debug-sentry', () => {
  throw new Error('Intentional test error for Sentry!');
});

//---------------------------
// Sentry Error Handling Middleware
//---------------------------
app.use(Sentry.Handlers.errorHandler()); // ✅ Sentry's error handler


app.use(errorHandler); // ✅ Attaching my custom error handler AFTER Sentry to avoid fails in Newman

// Optional: Add a fallback error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

//---------------------------
// Server Start
//---------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
