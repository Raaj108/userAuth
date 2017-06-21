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
mongoose.connect('mongodb://raj:password@ds133582.mlab.com:33582/user-auth');
//test database connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, " connection error"));
db.on('open', () => {
    console.log("Connected to database");
    app.listen(port); //if connected to db, then start listening on given port
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
//define request handlers
//Authenticate User on Sign-in/log in
app.post('/authenticate', (req, res) => {
    User.findOne({
        email: req.body.email
        , password: req.body.password
    }, (err, user) => {
        if (err) {
            res.json({
                type: false
                , data: "An error occured: " + err
            });
        }
        else {
            if (user) {
                res.json({
                    type: true
                    , data: user
                    , token: user.token
                });
            }
            else {
                res.json({
                    type: false
                    , data: "Incorrect Username or Password"
                });
            }
        }
    });
});
//Regidter/sign up new user
app.post('/signup', (req, res) => {
    User.findOne({
        email: req.body.email
        , password: req.body.password
    }, (err, user) => {
        if (err) {
            res.json({
                type: false
                , data: "An error occured: " + err
            });
        }
        else {
            if (user) {
                res.json({
                    type: false
                    , data: "User already exist"
                });
            }
            else {
                var newUser = new User();
                newUser.email = req.body.email;
                newUser.password = req.body.password;
                newUser.save((err, user) => {
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save((err, user1) => {
                        res.json({
                            type: true
                            , data: user1
                            , token: user1.token
                        });
                    });
                });
            }
        }
    });
});
// Start Server
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});