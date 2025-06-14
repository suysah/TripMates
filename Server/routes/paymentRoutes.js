const express = require('express');
const cors = require('cors');

const router = express.Router();
router.options('*', cors());

const authController = require('./../controllers/authController');
const paymentController = require('./../controllers/paymentController');

router.post(
  '/get-payment',
  authController.protect,
  paymentController.getPayment
);

module.exports = router;
