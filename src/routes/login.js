import { Router } from 'express';
import axios from 'axios'; // Import axios for making HTTP requests

const router = Router();

// POST route for login using Auth0
router.post('/', async (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  console.log('Attempting login for user:', username); // Debugging log
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

// Auth0 credentials and domain (fetched dynamically from .env)
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const authDomain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;


  try {
    // Send a POST request to Auth0's token endpoint to exchange credentials for a token
    const response = await axios.post(`https://${authDomain}/oauth/token`, {
      grant_type: 'password', // Auth0's grant type for resource owner password credentials
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience, // Specify the intended audience of the token
    });

    // Extract the access token from the Auth0 response
    const { access_token } = response.data;

    console.log('Login successful for user:', username); // Debugging log for success
    console.log('Access Token:', access_token); // Debugging log for token

    // Respond with the token
    return res.status(200).json({
      message: 'Successfully logged in!',
      token: access_token,
    });
  } catch (error) {
    console.error('Error during login process:', error.message); // Log the error message

    // Provide more detailed error context if available
    if (error.response) {
      console.error('Auth0 response data:', error.response.data);
    }

    // Respond with an error message
    return res.status(401).json({
      message: 'Invalid login credentials or authentication failed!',
      error: error.response?.data || 'Unknown error occurred',
    });
  }
});

export default router;
