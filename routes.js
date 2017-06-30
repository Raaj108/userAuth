/*https://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543*/
// Required Modules
var express = require('express');
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var app = express();
var User = require('./Models/User');

/*Serve the index page */
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
/*Serve Static files*/
//app.use('/Client', express.static(path.join(__dirname, '/Client')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/public', express.static(__dirname + '/public'));


/*Routing*/

//Authenticate User
app.get('/api/authenticate', function (req, res) {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }, function (err, user) {
    if (err) {
      res.json({
        type: false,
        data: "There was a problem logging in"
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
          data: "Incorrect Email or Password"
        })
      }
    }
  })
});


//Register New User
app.post('/api/signup', function (req, res) {
  //check if user already exist or not
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }, function (err, user) {
    if (err) {
      res.json({
        type: false,
        data: "There was a problem in Signing up"
      });
    } else {
      if (user) {
        res.json({
          type: false,
          data: "User already exist" //if user exist then send message
        });
      } else {
        var newUser = new User(); //otherwise create new user
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.save(function (err, user) { //save user info
          if (err) res.send(err)
          user.token = jwt.sign(user, process.env.JWT_SECRET); //generate token for new user
          user.save(function (err, user1) { //save new user's token
            if (err) res.send(err)
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

module.exports = router;
