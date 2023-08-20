const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
  },
  phone: {
    type: Number,
    required: [true, "phone must be provided"],
  },
  subject: {
    type: String,
    required: [true, "subject must be provided"],
  },
  message: {
    type: String,
    required: [true, "message must be provided"],
  },
  status: {
    type: String,
    default: "Active",
  },
  date: {
    type: String,
  },
});

const Contact = new mongoose.model("Contact", ContactSchema);
module.exports = Contact;
