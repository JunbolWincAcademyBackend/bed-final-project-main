import express from 'express'; // Import Express for creating routes
import { PrismaClient } from '@prisma/client'; // Import Prisma Client for database interaction
import authMiddleware from '../middleware/advancedAuth.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios
import getReviews from '../services/getReviews.js'; // Import the getReviews service

const prisma = new PrismaClient(); // Initialize Prisma Client
const reviewsRouter = express.Router(); // Create a router for reviews

// **Route to fetch all reviews with optional query parameters**
reviewsRouter.get('/', async (req, res, next) => {
  try {
    // Extract query parameters from the request
    const { userId, propertyId, rating } = req.query; // Query parameters to filter reviews

    // Call the getReviews service with the extracted query parameters ✅
    const reviews = await getReviews({ userId, propertyId, rating });

    res.status(200).json(reviews); // Respond with the list of reviews
  } catch (error) {
    console.error('Error fetching reviews:', error.message); // Log any errors
    next(error); // Pass errors to centralized error-handling middleware
  }
});

// **Route to fetch a review by ID**
reviewsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from the request parameters

    // Fetch the review by ID
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: true,       // Include the user who wrote the review
        property: true,   // Include the property being reviewed
      },
    });

    if (!review) {
      throw new NotFoundError('Review', id); // If review not found, throw a custom error
    }

    res.status(200).json(review); // Respond with the review details
  } catch (error) {
    console.error('Error fetching review by ID:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to create a new review**
reviewsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Extract review details from the request body
    const { userId, propertyId, rating, comment } = req.body;

    // Create the new review
    const newReview = await prisma.review.create({
      data: { userId, propertyId, rating, comment },
    });

    res.status(201).json({
      message: 'Review created successfully!',
      review: newReview,
    });
  } catch (error) {
    console.error('Error creating review:', error.message); // Log the error
    next(error); // Pass the error to the error-handling middleware
  }
});

// **Route to update a review by ID**
reviewsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from the request parameters
    const updatedFields = req.body; // Extract fields to update

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: updatedFields,
    });

    res.status(200).json({
      message: `Review with ID ${id} successfully updated`,
      review: updatedReview,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Review', id)); // Handle "not found" error
    } else {
      console.error('Error updating review:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

// **Route to delete a review by ID**
reviewsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from the request parameters

    // Delete the review
    const deletedReview = await prisma.review.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Review with ID ${id} successfully deleted`,
      review: deletedReview, // Include details of the deleted review
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new NotFoundError('Review', id)); // Handle "not found" error
    } else {
      console.error('Error deleting review:', error.message); // Log other errors
      next(error); // Pass the error to the error-handling middleware
    }
  }
});

export default reviewsRouter;
