//importing model
const Brand = require("../Models/Brand");

exports.getAllBrand = async (req, res) => {
  try {
    var data = await Brand.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {}
};
exports.getSingleBrand = async (req, res) => {
  try {
    var data = await Brand.findOne({ _id: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    await Brand.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    var data = await Brand.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;

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

exports.createBrand = async (req, res) => {
  try {
    var data = new Brand(req.body);
    await data.save();

    res.status(201).send({
      result: "Done",
      message: "Record is created",
      data: data,
    });
  } catch (error) {
    if (error.keyValue)
      res.status(500).send({ result: "fail", message: "Name must be unique" });
    // else if (error.errors.name)
    //   res
    //     .status(500)
    //     .send({ result: "fail", message: error.errors.name.message });
    else
      res
        .status(500)
        .send({ result: "fail", message: "Internal Server Error" });
  }
};
