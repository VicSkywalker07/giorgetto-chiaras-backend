const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  username: {
    type: String,
    required: [true, "Username must be provided"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "phone must be provided"],
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
  },
  addressLin1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  addressLine3: {
    type: String,
  },
  pin: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pic: {
    type: String,
  },
  role: {
    type: String,
    default: "Buyer",
  },
  otp: {
    type: Number,
  },
});

const User = new mongoose.model("User", UserSchema);
module.exports = User;
