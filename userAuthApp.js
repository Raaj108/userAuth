//https://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543

// Required Modules
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var app = express();


//define port
var port = process.env.PORT || 3001;
var User = require('./User');

//open a connection to database
mongoose.connect('mongodb://raj:anna@2310@ds133582.mlab.com:33582/user-auth');

//App congifuration
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});


//define request handlers
app.post('/authenticate', (req, res) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }, (err, user) => {
    if (err) {
      res.json({
        type: false,
        data: "An error has occured: " + err;
      });
    } else {
      if (user) {
        res.json({
          type: true,
          data: user,
          token: user.token
        });
      } else {
        res.json({
          type: false,
          data: "Incorrect Username or Password";
        });
      }
    }
  });
});


