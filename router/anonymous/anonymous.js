/**
 * Created by chanwoopark on 2017. 5. 13..
 */
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
var LocalStrategy = require('passport-local').Strategy;



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


//데이터가 봐뀌면 데이터를 담당하는 그룹을 수정하게끔 , 즉 데이터를 받아서 사용하게끔 할


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
connection.connect(err => {
    if (err) {
        throw new Error('Mysql connect failed');
    }
    console.log('Mysql connected');
});

passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log('passport session get id : ', id);
    done(null,id);
});


passport.use('local-anonymous', new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, id, password, done){
        done(null,{'id':'anonymous'});
    }
    )
);

router.post('/', function(req,res,next){
    passport.authenticate('local-anonymous', function(err, user, info){
        if(err) res.status(500).json(err);
        if(!user) return res.status(401).send(info.message);

        req.logIn(user, function(err){
            if(err){return next(err); }
            return res.send("login success");
        });
    })(req,res,next);
});

module.exports = router;

