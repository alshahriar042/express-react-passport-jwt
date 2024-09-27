require("dotenv").config();
require("./config/db");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');
const passport = require("passport");


const app = express();
app.use(cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

require("./config/passport");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) return res.status(400).send("User already exists");
      bcrypt.hash(req.body.password, saltRounds,async (err, hash)=> {

        const newUser = new User({
          username: req.body.username,
          password: hash,
        });
        await newUser
          .save()
          .then((user) => {
            res.send({
              success: true,
              message: "User is created Successfully",
              user: {
                id: user._id,
                username: user.username,
              },
            });
          })
          .catch((error) => {
            res.send({
              success: false,
              message: "User is not created",
              error: error,
            });
          });
        });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
app.post("/login", async(req, res) => {

const user = await User.findOne({ username: req.body.username });
if (!user){
  return res.send("User not found").status(404);
}

if(!bcrypt.compareSync(req.body.password, user.password)){
  return res.send("Login Failed");

}
const payload = {
  id: user._id,
  username: user.username,
}
 const token =  jwt.sign(payload, process.env.SECRET_KEY,{
  expiresIn:"2d"
 });
 return res.status(200).send({
  success:true,
   message:"Login Successfull", token:"Bearer " + token});

});


app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);


app.use((req, res, next) => {
  res.status(404).send("Resource Not Found");
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Gone");
  console.log(err);
});

module.exports = app;
