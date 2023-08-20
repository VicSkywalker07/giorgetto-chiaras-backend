const express = require("express");
const getConnect = require("./dbConnect");

const dotenv = require("dotenv");
dotenv.config({ path: "./utils/config.env" });

const router = require("./Routes/routes");
const cors = require("cors");
const app = express();

getConnect();
app.use("/public", express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(8000, () => {
  console.log("listening on port 8000");
});
