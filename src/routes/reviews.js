import express from 'express'; // Import Express for creating routes
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import NotFoundError from '../errors/NotFoundError.js'; // Import custom error for handling "not found" scenarios

// ✅ Import the services
import getReviews from '../services/reviews/getReviews.js';
import getReviewById from '../services/reviews/getReviewById.js';
import createReview from '../services/reviews/createReview.js';
import updateReviewById from '../services/reviews/updateReviewById.js';
import deleteReviewById from '../services/reviews/deleteReviewById.js';

const reviewsRouter = express.Router(); // Create a router for reviews

// **📌 Route to fetch all reviews with optional query parameters**
reviewsRouter.get('/', async (req, res, next) => {
  try {
    const { userId, propertyId, rating } = req.query;
    const reviews = await getReviews({ userId, propertyId, rating });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('❌ Error fetching reviews:', error.message);
    next(error);
  }
});

// **📌 Route to fetch a single review by ID**
reviewsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      throw new NotFoundError('Review', id);
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('❌ Error fetching review by ID:', error.message);
    next(error);
  }
});

// **📌 Route to create a new review**
reviewsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    const newReview = await createReview({ userId, propertyId, rating, comment });

    res.status(201).json({
      message: '✅ Review created successfully!',
      review: newReview,
    });
  } catch (error) {
    console.error('❌ Error creating review:', error.message);
    next(error);
  }
});

// **📌 Route to update a review by ID**
reviewsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedReview = await updateReviewById(id, updatedFields);

    if (!updatedReview) {
      throw new NotFoundError('Review', id);
    }

    res.status(200).json({
      message: `✅ Review with ID ${id} successfully updated`,
      review: updatedReview,
    });
  } catch (error) {
    console.error('❌ Error updating review:', error.message);
    next(error);
  }
});

// **📌 Route to delete a review by ID**
reviewsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await deleteReviewById(id);

    if (!deletedReview) {
      throw new NotFoundError('Review', id);
    }

    res.status(200).json({
      message: `✅ Review with ID ${id} successfully deleted`,
      review: deletedReview,
    });
  } catch (error) {
    console.error('❌ Error deleting review:', error.message);
    next(error);
  }
});

export default reviewsRouter;
