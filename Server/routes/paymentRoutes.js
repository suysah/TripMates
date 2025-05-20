const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');
const paymentController = require('./../controllers/paymentController');

router.post(
  '/get-payment',
  authController.protect,
  paymentController.getPayment
);

module.exports = router;
