const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
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
  pic: {
    type: String,
  },
});

const Wishlist = new mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;
