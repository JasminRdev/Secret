//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

//send to db with serverhelp our email and pw
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
//then save with callback
  newUser.save(function(err){
    if(err){
      console.log(err)
    } else {
      res.render("secrets");
    }
  });
});


//if username was found in db ->
//if usernames corresponding pw -- is equal -- to what we received also now with username togehter ->
//send me to the secret ejs file
app.post("/login", function(req,res){
const username = req.body.username;
const password = req.body.password;

User.findOne({email: username}, function(err, foundUser){
  if(err){
    console.log(err);
  } else {
    if (foundUser) {
      if(foundUser.password === password) {
        res.render("secrets");
      }
    }
  }

});
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
