const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
router.options('*', cors());

// const bookingController = require('../controllers/bookingController');

// router.use(authController.isLoggedIn);

// router.get(
//   '/',
//   // bookingController.createBookingCheckout,
//   authController.isLoggedIn,
//   viewsController.getOverview
// );
// // router.get('/tour', viewsController.getTour);
// router.get('/tour/:name', authController.isLoggedIn, viewsController.getTour);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// router.get(
//   '/sign-up',
//   authController.isLoggedIn,
//   viewsController.getSignUpForm
// );

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
// router.get(
//   '/payment/:tourId',
//   authController.protect,
//   viewsController.getPaymentPage
// );

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
