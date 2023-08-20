//importing model
const Contact = require("../Models/Contact");

exports.getAllContact = async (req, res) => {
  try {
    var data = await Contact.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {}
};
exports.getSingleContact = async (req, res) => {
  try {
    var data = await Contact.findOne({ _id: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.updateContact = async (req, res) => {
  try {
    var data = await Contact.findOne({ _id: req.params._id });
    if (data) {
      data.status = req.body.status ?? data.status;

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

exports.createContact = async (req, res) => {
  try {
    var data = new Contact(req.body);
    data.date = new Date();
    await data.save();

    res.status(201).send({
      result: "Done",
      message: "Record is created",
      data: data,
    });
  } catch (error) {
    if (error.errors.name)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.name.message });
    else if (error.errors.email)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.email.message });
    else if (error.errors.phone)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.phone.message });
    else if (error.errors.subject)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.subject.message });
    else if (error.errors.message)
      res
        .status(500)
        .send({ result: "fail", message: error.errors.message.message });
    else
      res
        .status(500)
        .send({ result: "fail", message: "Internal Server Error" });
  }
};
