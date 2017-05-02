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
var session = require('express-session');
var flash = require('connect-flash');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

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


router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


router.get('/', function (req, res) {
    //view template을 사용 안했을때 에러 메세지를 어떻게 보여줄 것인가.
    res.sendFile(path.join(__dirname, '../../public/html/loginPage.html'));
});

router.get('/failure', function (req, res) {
    let errMsg = req.flash('error');
    console.log(errMsg);
    res.send(errMsg);

});

router.get('/success', function (req, res) {
    res.send("success-signup");
});

passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user);
    //done의 두번째 인자를 deserializer에게 전달
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    console.log('passport session get id : ', id);
    done(null,id);
});


passport.use('local-login', new LocalStrategy({
        usernameField: 'signup-id',
        passwordField: 'signup-password',
        session:false,
        passReqToCallback: true
    }, function (req, id, password, done) {
        let query = connection.query('select * from user where id=?', [id], function (err, rows) {
            if (err) return done(err);
            //입력한 아이디가 있을떄
            if (rows.length) {
                return done(null, false, {message: "fail-same-id"});

            }else if(!rows.length) {
                let query = connection.query('select * from user where email=?', req.body['signup-email'], function(err,rows){
                    if(err) return done(err);
                    //email in used
                    if(rows.length){
                        return done(null,false,{message:"fail-same-email"});
                        //if if , if else if , if else 생각해볼것
                    }else{
                        let email = req.body['signup-email'];
                        let sql = {'id': id, 'password': password, 'email': email};
                        //mysql에 입력란값들을 저장함
                        let query = connection.query('insert into user set ?', sql, function (err, rows) {
                            if (err) throw err;
                            return done(null, {'id': id, 'rows': rows});
                            //done의 두번째 인자로 false를 전달해주지 않을때, 즉 true일때
                            //두번째 인자를 passport.serializeUser의 콜백함수 user 인자 값으로 전해준다.
                        })
                    }
                })
            }
        })
    }
    )
);

router.post('/', passport.authenticate('local-login', {
        //클릭했을때 ajax통신을 성공했을때 ,실패했을때 리 다이렉션해서 그 url에서 res값이 ajax통해서 받은 res값
        successRedirect: '/login/success',
        failureRedirect: '/login/failure',
        failureFlash: true
    }
    )
);

module.exports = router;

