require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/jwtv2")
  .then(() => {
    console.log("db is connected");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });