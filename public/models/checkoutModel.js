const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  cartItemIds: {
    type: [String],
    required: true
  }
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
