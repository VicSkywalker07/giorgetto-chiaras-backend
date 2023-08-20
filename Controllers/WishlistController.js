//importing model
const Wishlist = require("../Models/Wishlist");

exports.getAllWishlist = async (req, res) => {
  try {
    var data = await Wishlist.find({ userid: req.params.userid }).sort({
      _id: -1,
    });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {}
};

exports.deleteWishlist = async (req, res) => {
  try {
    await Wishlist.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.createWishlist = async (req, res) => {
  try {
    var data = new Wishlist(req.body);
    await data.save();

    res.status(201).send({
      result: "Done",
      message: "Record is created",
      data: data,
    });
  } catch (error) {
    if (error.errors.userid)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.userid.message });
    else if (error.errors.productId)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.productId.message });
    else if (error.errors.brand)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.brand.message });
    else if (error.errors.color)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.color.message });
    else if (error.errors.size)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.size.message });
    else if (error.errors.price)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.price.message });
    else
      res
        .status(500)
        .send({ result: "fail", message: "Internal Server Error" });
  }
};
