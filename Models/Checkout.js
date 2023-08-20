const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, "userid must be provided"],
  },
  paymentMode: {
    type: String,
    default: "COD",
  },
  paymentStatus: {
    type: String,
    default: "Pending",
  },
  orderStatus: {
    type: String,
    default: "Order Placed",
  },
  subTotal: {
    type: Number,
    required: [true, "Subtotal must required"],
  },
  shipping: {
    type: String,
    required: [true, "Shipping must required"],
  },
  total: {
    type: Number,
    required: [true, "Total must required"],
  },
  rppid: {
    type: String,
    default: "",
  },
  date: {
    type: String,
  },

  products: [
    {
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
    },
  ],
});

const Checkout = new mongoose.model("Checkout", CheckoutSchema);
module.exports = Checkout;
