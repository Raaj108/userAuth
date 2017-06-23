//https://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
// Required Modules
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var app = express();
var User = require('./Models/User');
var router = express.Router();


//Serve the index page 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//Serve Static files
app.use('/_resources', express.static(path.join(__dirname, '/_resources')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/partials', express.static(__dirname + '/partials'));

/*Routing*/
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname + '/partials/home.html'));
});

//define request handlers
/*Authenticate User on Sign-in/log in*/
app.post('/authenticate', (req, res) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }, (err, user) => {
    if (err) {
      res.json({
        type: false,
        data: "An error occured: " + err
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
          data: "Incorrect Username or Password"
        });
      }
    }
  });
});

/*Regidter/sign up new user*/
app.post('/signup', (req, res) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }, (err, user) => {
    if (err) {
      res.json({
        type: false,
        data: "An error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          type: false,
          data: "User already exist"
        });
      } else {
        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.save((err, user) => {
          user.token = jwt.sign(user, process.env.JWT_SECRET);
          user.save((err, user1) => {
            res.json({
              type: true,
              data: user1,
              token: user1.token
            });
          });
        });
      }
    }
  });
});
