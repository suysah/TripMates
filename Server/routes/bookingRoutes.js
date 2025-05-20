const express = require('express');

const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.use(authController.protect);

// router.get(
//   '/checkout-session/:tourId',
//   authController.protect,
//   bookingController.getCheckoutSession
// );

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.getAllBookings
  )
  .post(bookingController.createBooking);
router
  .route('/:id')
  .get(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.getBooking
  )
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.updateBooking
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.deleteBooking
  );

module.exports = router;
