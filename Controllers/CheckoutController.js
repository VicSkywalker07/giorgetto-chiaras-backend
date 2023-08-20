//importing model
const Checkout = require("../Models/Checkout");

exports.getAllCheckout = async (req, res) => {
  try {
    // var data = await Checkout.find().sort({ _id: -1 });
    var data = await Checkout.find().sort({
      _id: -1,
    });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res.status(500).send({
      result: "fail",
      message: "Internal Server Error!!!",
    });
  }
};
exports.getAllUserCheckout = async (req, res) => {
  try {
    // var data = await Checkout.find().sort({ _id: -1 });
    var data = await Checkout.find({ userid: req.params.userid }).sort({
      _id: -1,
    });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res.status(500).send({
      result: "fail",
      message: "Internal Server Error!!!",
    });
  }
};
exports.getSingleCheckout = async (req, res) => {
  try {
    var data = await Checkout.findOne({ _id: req.params._id }).sort({
      _id: -1,
    });
    if (data) res.send({ result: "Done", count: data.length, data: data });
    else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.deleteCheckout = async (req, res) => {
  try {
    await Checkout.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.updateCheckout = async (req, res) => {
  try {
    var data = await Checkout.findOne({ _id: req.params._id });
    if (data) {
      data.paymentMode = req.body.paymentMode ?? data.paymentMode;
      data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus;
      data.orderStatus = req.body.orderStatus ?? data.orderStatus;
      data.rppid = req.body.rppid ?? data.rppid;

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

exports.createCheckout = async (req, res) => {
  try {
    var data = new Checkout(req.body);
    data.date = new Date();
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
    else if (error.errors.subTotal)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.subTotal.message });
    else if (error.errors.total)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.total.message });
    else if (error.errors.shipping)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.shipping.message });
    else
      res
        .status(500)
        .send({ result: "fail", message: "Internal Server Error" });
  }
};
