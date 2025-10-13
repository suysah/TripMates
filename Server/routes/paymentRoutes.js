const express = require('express');
const cors = require('cors');

const router = express.Router();
router.options('*', cors());

const authController = require('./../controllers/authController');
const paymentController = require('./../controllers/paymentController');

router.use(authController.protect);

// Legacy route
router.post('/get-payment', paymentController.getPayment);

// Create a payment (bill)
router.post('/', paymentController.createPayment);

// Get my payments (bills)
router.get('/me', paymentController.getMyPayments);

module.exports = router;
