const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, "UserId must be provided"],
  },
  productId: {
    type: String,
    required: [true, "productId must be provided"],
  },
  brand: {
    type: String,
    required: [true, "brand must be provided"],
  },
  color: {
    type: String,
    required: [true, "color must be provided"],
  },
  size: {
    type: String,
    required: [true, "size must be provided"],
  },
  price: {
    type: Number,
    required: [true, "price must be provided"],
  },
  qty: {
    type: Number,
    required: [true, "qty must be provided"],
  },
  total: {
    type: Number,
    required: [true, "total must be provided"],
  },
  pic: {
    type: String,
  },
});

const Cart = new mongoose.model("Cart", CartSchema);
module.exports = Cart;
