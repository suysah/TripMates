const Payment = require('../models/paymentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
