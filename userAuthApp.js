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

/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};

//define MongoDB database URL
var mongodbUri = 'mongodb://raj:password@ds129462.mlab.com:29462/userauth';

//open a connection to database
mongoose.connect(mongodbUri, options);
//test database connection
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, "connection error"));
conn.on('open', () => {
  console.log("Connected to database");
  //if connected to db, then start the app, listening on given port
  app.listen(port);
  console.log("listening on " + port);
});
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

//If uncaughtException occurs, then the Nodejs App crash is prevented and an error log is printed in the console
process.on('uncaughtException', function (err) {
  console.log(err);
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
