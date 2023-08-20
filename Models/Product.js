const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  mainCategory: {
    type: String,
    required: [true, "MainCategory must be provided"],
  },
  subCategory: {
    type: String,
    required: [true, "SubCategory must be provided"],
  },
  brand: {
    type: String,
    required: [true, "Brand must be provided"],
  },
  color: {
    type: String,
    required: [true, "color must be provided"],
  },
  size: {
    type: String,
    required: [true, "size must be provided"],
  },
  basePrice: {
    type: Number,
    required: [true, "basePrice must be provided"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    required: [true, "finalPrice must be provided"],
  },
  stock: {
    type: String,
    default: "In Stock",
  },
  description: {
    type: String,
    default: "This is a sample Product",
  },
  pic1: {
    type: String,
    required: [true, "pic1 must be provided"],
  },
  pic2: {
    type: String,
    default: "",
  },
  pic3: {
    type: String,
    default: "",
  },
  pic4: {
    type: String,
    default: "",
  },
});

const Product = new mongoose.model("Product", ProductSchema);
module.exports = Product;
