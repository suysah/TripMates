const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Booking = require('./../models/bookingModel');
const factory = require('./../controllers/handleFactory');

// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   // 1 Get the currently booked tour
//   const tour = await Tour.findById(req.params.tourId);
//   if (!tour) {
//     return next(new AppError('Tour does not exist', 404));
//   }

//   // 2 Create checkoout session

//   // 3 create session as response
// });

// exports.createBookingCheckout = async (req, res, next) => {
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) {
//     return next();
//   }

//   await Booking.create({ tour, user, price });
//   res.redirect(req.originalUrl.split('?')[0]);
// };

exports.createBooking = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;

  const booking = await Booking.create(req.body);

  if (!booking) return next('Bookinng uncessfull', 400);

  res.status(200).json({
    status: 'success',
    message: 'Booking successfull',
  });
});

exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
