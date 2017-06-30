/*https://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543*/
// Required Modules
var express = require('express');
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var app = express();
var User = require('./Models/User');
var router = express.Router();
/*Serve the index page */
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
/*Serve Static files*/
router.use('/Client', express.static(path.join(__dirname, '/Client')));
router.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
router.use('/Client', express.static(__dirname + '/Client'));
/*Routing*/
module.exports = router;