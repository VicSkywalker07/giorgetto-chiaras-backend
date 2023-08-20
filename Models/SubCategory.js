const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    unique: true,
  },
});

const SubCategory = new mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategory;
