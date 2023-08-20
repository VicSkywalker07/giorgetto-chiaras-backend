const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./utils/config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DBPASSWORD);

const getConnect = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("connected to database");
  } catch (err) {
    console.error(err);
  }
};

module.exports = getConnect;
