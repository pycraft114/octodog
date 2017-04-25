/**
 * Created by chanwoopark on 2017. 4. 25..
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var options = require('../option');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy
var session = require('express-session');
var flash = require('connect-flash');


var mysqlData = {
    host: options.storageConfig.HOST,
    user: options.storageConfig.user,
    password: options.storageConfig.password
};

var connection = mysql.createConnection({
    host: mysqlData.host,
    port: 3306,
    user: mysqlData.user,
    password: mysqlData.password,
    database: 'octodog',
    multipleStatements: true
});
connection.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'../../public/html/loginPage.html'));
    console.log("hi");
});


passport.use('local-join',new LocalStrategy({
    _usernameField: 'signup-id',
    _passwordField: 'signup-password',
    _passReqToCallback: true
    }, function(req,id,passord,done){
        console.log("called")
        }
    )
);

router.post('/',passport.authenticate('local-join',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
        }
    )
);

module.exports = router;