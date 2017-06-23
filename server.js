var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 3001;
var userAuthApp = require('./userAuthApp');
var app = express();

app.use('/', userAuthApp);

//this will let us get data from the request
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

//If uncaughtException occurs, then the Nodejs App crash is prevented and an error log is printed in the console
process.on('uncaughtException', function (err) {
  console.log(err);
});
