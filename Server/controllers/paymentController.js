const Payment = require('../models/paymentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Legacy endpoint (kept for backward compatibility)
exports.getPayment = catchAsync(async (req, res, next) => {
  req.body.user_id = req.user.id;
  const payInfo = await Payment.create(req.body);

  if (!payInfo) {
    return next(AppError('Tour does not exist!', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Payment successful',
  });
});

// Create a payment record with basic validation (no external gateway)
exports.createPayment = catchAsync(async (req, res, next) => {
  const { card_no, cvv, payment_id, tour_name, tour_price } = req.body;

  if (!card_no || !cvv || !payment_id || !tour_name || !tour_price) {
    return next(new AppError('Missing required payment fields', 400));
  }

  const cardNumberString = String(card_no);
  const cvvString = String(cvv);

  const isDigitsOnly = (s) => /^\d+$/.test(s);

  if (
    !isDigitsOnly(cardNumberString) ||
    cardNumberString.length < 12 ||
    cardNumberString.length > 19
  ) {
    return next(new AppError('Invalid card number', 400));
  }

  if (
    !isDigitsOnly(cvvString) ||
    (cvvString.length !== 3 && cvvString.length !== 4)
  ) {
    return next(new AppError('Invalid CVV', 400));
  }

  const paymentData = {
    user_id: req.user.id,
    card_no: Number(cardNumberString),
    cvv: Number(cvvString),
    payment_id,
    tour_name,
    tour_price,
  };

  const created = await Payment.create(paymentData);

  res.status(201).json({
    status: 'success',
    data: {
      payment: created,
    },
  });
});

// List payments for the authenticated user
exports.getMyPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ user_id: req.user.id }).sort({
    date: -1,
  });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments,
    },
  });
});
