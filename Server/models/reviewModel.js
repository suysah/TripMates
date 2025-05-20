const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  next();
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Static method to calculate average ratings

// ---
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const Tour = require('./tourModel'); // Dynamically require Tour model due to circular dependency

  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, // Default average rating
    });
  }
};

// Middleware to update ratings after saving a review
reviewSchema.post('save', function () {
  const Review = mongoose.model('Review'); // Explicitly access the model
  Review.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.model.findOne(this.getQuery()); // Fetch the document and store it
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.doc) {
    // If the document exists, call calcAverageRatings
    await this.doc.constructor.calcAverageRatings(this.doc.tour);
  }
});
// ---

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
