//importing model
const Cart = require("../Models/Cart");

exports.getAllCart = async (req, res) => {
  try {
    // var data = await Cart.find().sort({ _id: -1 });
    var data = await Cart.find({ userid: req.params.userid }).sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res.status(500).send({
      result: "fail",
      message: "Internal Server Error!!!",
    });
  }
};
exports.getSingleCart = async (req, res) => {
  try {
    var data = await Cart.findOne({ _id: req.params._id }).sort({ _id: -1 });
    if (data) res.send({ result: "Done", count: data.length, data: data });
    else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    var data = await Cart.findOne({ _id: req.params._id });
    if (data) {
      data.qty = req.body.qty ?? data.qty;
      data.total = req.body.total ?? data.total;

      await data.save();
      data.name = res.send({
        result: "Done",
        message: "record is updated",
        data: data,
      });
    } else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    console.log(error);
    if (error.keyValue)
      res.status(500).send({ result: "fail", message: "Name must be unique" });
    else
      res
        .status(500)
        .send({ result: "fail", Message: "Internal server error" });
  }
};

exports.createCart = async (req, res) => {
  try {
    var data = new Cart(req.body);
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
    else if (error.errors.qty)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.qty.message });
    else if (error.errors.total)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.total.message });
    else
      res
        .status(500)
        .send({ result: "fail", message: "Internal Server Error" });
  }
};
