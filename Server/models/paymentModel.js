const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    // required: true,
  },
  card_no: {
    type: Number,
    required: true,
  },
  cvv: {
    type: Number,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
  tour_name: {
    type: String,
    required: true,
  },
  tour_price: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
