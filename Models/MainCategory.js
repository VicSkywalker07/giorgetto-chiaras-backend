const mongoose = require("mongoose");

const MainCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    unique: true,
  },
});

const MainCategory = new mongoose.model("MainCategory", MainCategorySchema);
module.exports = MainCategory;
