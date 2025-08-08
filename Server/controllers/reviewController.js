const AppError = require('./../utils/appError');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReviewsBYUser = catchAsync(async (req, res) => {
  const data = await Review.find({ user: req.user.id });
  res.status(200).json({
    message: 'success',
    data: data,
  });
});

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;

  if (!review || !rating || !tour || !user) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newReview = await Review.create({ review, rating, tour, user });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
