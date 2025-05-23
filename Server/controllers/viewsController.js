const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Booking = require('../models/bookingModel');

// exports.getPaymentPage = catchAsync(async (req, res, next) => {
//   //1 get tour data
//   const tour = await Tour.findById(req.params.tourId);

//   if (!tour) {
//     return next(new AppError('There is no tour with this name', 404));
//   }

//   res.status(200).render('payment', {
//     tour,
//   });
// });

// exports.getOverview = catchAsync(async (req, res, next) => {
//   //1 get tour data
//   const tours = await Tour.find();
//   //2 build templet

//   //3 render that templet using tour data from 1

//   res.status(200).render('overview', {
//     title: 'All tours',
//     tours,
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   const { name } = req.params;
//   const tour = await Tour.findOne({ slug: name }).populate({
//     path: 'reviews',
//     fields: 'review rating user',
//   });
//   // console.log(tour);
//   if (!tour) {
//     return next(new AppError('There is no tour with this name', 404));
//   }

//   res.status(200).render('tour', {
//     title: name,
//     tour,
//   });
// });

// exports.getLoginForm = (req, res) => {
//   res.status(200).render('login', {
//     title: 'Log into your account',
//   });
// };
// exports.getSignUpForm = (req, res) => {
//   res.status(200).render('signup', {
//     title: 'Create an account',
//   });
// };

exports.getAccount = (req, res) => {
  res.status(200).json({ user: req.user });
};

// exports.updateUserData = async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// };

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1 Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2 Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).json({
    title: 'My tours',
    tours,
  });
});
