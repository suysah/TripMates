const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true }); //to get the parameter from the parent router
const cors = require('cors');

//POSt /tours/579873/reviews
//POSt /reviews
//GET /tours/579873/reviews
router.options('*', cors());

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews);
router.route('/reviewsByUser').get(reviewController.getReviewsBYUser);

router
  .route('/:id')
  .get(reviewController.getReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
