import * as Sentry from '@sentry/node';
import 'dotenv/config'; // Load environment variables from .env

// Debug log
console.log('Sentry DSN:', process.env.SENTRY_DSN);

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN, // Use the DSN from the .env file
  tracesSampleRate: 1.0, // Adjust this for performance monitoring
});
