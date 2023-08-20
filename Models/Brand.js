const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    unique: true,
  },
});

const Brand = new mongoose.model("Brand", BrandSchema);
module.exports = Brand;
