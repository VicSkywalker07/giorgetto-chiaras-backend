//importing model
const User = require("../Models/User");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { log } = require("console");

//Node mailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  tls: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have uppercase letters
  .has()
  .lowercase(1) // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

exports.getAllUser = async (req, res) => {
  try {
    var data = await User.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {}
};
exports.getSingleUser = async (req, res) => {
  try {
    var data = await User.findOne({ _id: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "fail", Message: "Data not found" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is deleted" });
  } catch (error) {
    res.status(500).send({ result: "fail", Message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    var data = await User.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;
      data.email = req.body.email ?? data.email;
      data.phone = req.body.phone ?? data.phone;
      data.password = req.body.password ?? data.password;
      data.addressLine1 = req.body.addressLine1 ?? data.addressLine1;
      data.addressLine2 = req.body.addressLine2 ?? data.addressLine2;
      data.addressLine3 = req.body.addressLine3 ?? data.addressLine3;
      data.pin = req.body.pin ?? data.pin;
      data.city = req.body.city ?? data.city;
      data.state = req.body.state ?? data.state;

      try {
        if (req.file.filename && data.pic)
          fs.unlinkSync("public/users/" + data.pic);
        data.pic = req.file.filename;
      } catch (error) {}

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

exports.createUser = async (req, res) => {
  if (schema.validate(req.body.password)) {
    try {
      var data = new User(req.body);
      bcrypt.hash(req.body.password, 12, async (error, hash) => {
        if (error) res.send({ result: "failed", error: error });
        else {
          data.password = hash;
          await data.save();
          res.status(201).send({
            result: "Done",
            message: "Record is created",
            data: data,
          });
        }
      });
    } catch (error) {
      if (error.keyValue)
        res.status(500).send({ result: "fail", message: error });
      else if (error.errors.name)
        res
          .status(500)
          .send({ result: "fail", message: error.errors.name.message });
      else if (error.MongoServerError)
        res.status(500).send({ result: "fail", message: "unique" });
      else if (error.errors.username)
        res
          .status(500)
          .send({ result: "fail", message: error.errors.username.message });
      else if (error.errors.email)
        res
          .status(500)
          .send({ result: "fail", message: error.errors.email.message });
      else if (error.errors.phone)
        res
          .status(500)
          .send({ result: "fail", message: error.errors.phone.message });
      else if (error.errors.password)
        res
          .status(500)
          .send({ result: "fail", message: error.errors.password.message });
      else
        res
          .status(500)
          .send({ result: "fail", message: "Internal Server Error" });
    }
  } else {
    res.status(500).send({
      result: "fail",
      message:
        "Password must be greater or equal to 8 and less then equal to 100 characters, must contain atlest 1 digit , 1 uppercase, 1 lowercase and should not contain spaces",
    });
  }
};

//============================================================================

exports.login = async (req, res) => {
  try {
    var data = await User.findOne({ username: req.body.username });
    if (data) {
      if (await bcrypt.compare(req.body.password, data.password)) {
        let key =
          data.role === "Buyer"
            ? process.env.JWT_BUYER_KEY
            : process.env.JWT_ADMIN_KEY;
        jwt.sign({ data }, key, (error, token) => {
          if (error)
            res
              .status(500)
              .send({ result: "failed", message: "Internal Server Error" });
          else
            res.status(200).send({ result: "done", data: data, token: token });
        });
      }
    } else
      res
        .status(404)
        .send({ result: "fail", message: "Invalid username or password" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "failed", message: "Internal Server Error" });
  }
};

//------------------------------------------------------------------------
//forget password

exports.forgetPassword = async (req, res) => {
  try {
    var data = await User.findOne({ username: req.body.username });
    if (data) {
      var otp = parseInt(Math.random() * 1000000);
      data.otp = otp;

      await data.save();

      //sending email
      const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: data.email,
        subject: "OTP for password reset!!! : Support team Giorgetto chiaras",
        text: `
        OTP for Password Reset is ${otp}
        Support Team Giorgetto Chiaras`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (!error)
          res.status(200).send({
            result: "Done",
            message: "Otp has been sent to your registered email id",
          });
        else
          res
            .status(500)
            .send({ result: "failed", message: "Internal Server Error" });
      });
    } else {
      res.send({ result: "fail", message: "Username not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ result: "failed", message: "Internal Server Error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    var data = await User.findOne({ username: req.body.username });
    if (data) {
      if (data.otp == req.body.otp) {
        res.status(200).send({ result: "Done", message: "OTP Matched !!!" });
      } else
        res.status(401).send({ result: "Done", message: "Invalid OTP!!!" });
    } else
      res
        .status(401)
        .send({ result: "failed", message: "UnAuthorized Access" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "failed", message: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    var data = await User.findOne({ username: req.body.username });
    if (data) {
      if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
          if (error) res.send({ result: "failed", error: error });
          else {
            data.password = hash;
            await data.save();
            res.status(201).send({
              result: "Done",
              message: "Password is updated!!!",
            });
          }
        });
      } else {
        res.status(500).send({
          result: "fail",
          message:
            "Password must be greater or equal to 8 and less then equal to 100 characters, must contain atlest 1 digit , 1 uppercase, 1 lowercase and should not contain spaces",
        });
      }
    } else
      res
        .status(401)
        .send({ result: "failed", message: "UnAuthorized Access" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "failed", message: "Internal Server Error" });
  }
};
