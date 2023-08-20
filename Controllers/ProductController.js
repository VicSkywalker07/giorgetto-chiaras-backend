//importing model
const Product = require("../Models/Product");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/products");
  },
  filename: function (req, file, cb) {
    cb(null, date().now() + file.originalname);
  },
  limits: {
    feildSize: 10 * 1024 * 1024,
  },
});

exports.getAllProduct = async (req, res) => {
  try {
    var data = await Product.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {}
};
exports.getSingleProduct = async (req, res) => {
  try {
    var data = await Product.findOne({ _id: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    data = await Product.findOne({ _id: req.params._id });
    try {
      fs.unlinkSync("public/products/" + data.pic1);
    } catch (err) {}
    try {
      fs.unlinkSync("public/products/" + data.pic2);
    } catch (err) {}
    try {
      fs.unlinkSync("public/products/" + data.pic3);
    } catch (err) {}
    try {
      fs.unlinkSync("public/products/" + data.pic4);
    } catch (err) {}
    await data.deleteOne();
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    var data = await Product.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;
      data.mainCategory = req.body.mainCategory ?? data.mainCategory;
      data.subCategory = req.body.subCategory ?? data.subCategory;
      data.brand = req.body.brand ?? data.brand;
      data.color = req.body.color ?? data.color;
      data.size = req.body.size ?? data.size;
      data.basePrice = req.body.basePrice ?? data.basePrice;
      data.discount = req.body.discount ?? data.discount;
      data.finalPrice = req.body.finalPrice ?? data.finalPrice;
      data.stock = req.body.stock ?? data.stock;
      data.description = req.body.description ?? data.description;

      try {
        if (req.files.pic1[0] && data.pic1) {
          fs.unlinkSync("public/products/" + data.pic1);
        }
        data.pic1 = req.files.pic1[0].filename;
      } catch (err) {}
      try {
        if (req.files.pic2[0] && data.pic2) {
          fs.unlinkSync("public/products/" + data.pic2);
        }
        data.pic2 = req.files.pic2[0].filename;
      } catch (err) {}
      try {
        if (req.files.pic3[0] && data.pic3) {
          fs.unlinkSync("public/products/" + data.pic3);
        }
        data.pic3 = req.files.pic3[0].filename;
      } catch (err) {}
      try {
        if (req.files.pic4[0] && data.pic4) {
          fs.unlinkSync("public/products/" + data.pic4);
        }
        data.pic4 = req.files.pic4[0].filename;
      } catch (err) {}
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

exports.createProduct = async (req, res) => {
  try {
    var data = new Product(req.body);

    try {
      data.pic1 = req.files.pic1[0].filename;
    } catch (err) {}
    try {
      data.pic2 = req.files.pic2[0].filename;
    } catch (err) {}
    try {
      data.pic3 = req.files.pic3[0].filename;
    } catch (err) {}
    try {
      data.pic4 = req.files.pic4[0].filename;
    } catch (err) {}
    console.log(data);
    await data.save();

    res.status(201).send({
      result: "Done",
      message: "Record is created",
      data: data,
    });
  } catch (error) {
    // res.status(500).send({ message: error });
    // console.error(error);

    if (error.errors.name) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.name.message });
    } else if (error.errors.mainCategory) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.mainCategory.message });
    } else if (error.errors.subCategory) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.subCategory.message });
    } else if (error.errors.brand) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.brand.message });
    } else if (error.errors.color) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.color.message });
    } else if (error.errors.size) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.size.message });
    } else if (error.errors.basePrice) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.basePrice.message });
    } else if (error.errors.dinalPrice) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.dinalPrice.message });
    } else if (error.errors.pic1) {
      res
        .status(500)
        .send({ result: "Fail", message: error.errors.pic1.message });
    } else
      res
        .status(500)
        .send({ result: "fail", message: "Internal Server Error" });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    var data = await Product.find({
      $or: [
        { name: { $regex: req.body.search, $options: "i" } },
        { mainCategory: req.body.search },
        { subCategory: req.body.search },
        { brand: req.body.search },
        { color: { $regex: req.body.search, $options: "i" } },
        { size: { $regex: req.body.search, $options: "i" } },
        { stock: { $regex: req.body.search, $options: "i" } },
        { description: { $regex: req.body.search, $options: "i" } },
      ],
    });
    res.status(200).send({ result: "Done", count: data.length, data: data });
  } catch (err) {
    res.status(500).send({
      result: "fail",
      message: "Internal Server Error!",
    });
  }
};
