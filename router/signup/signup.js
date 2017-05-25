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
var multer = require('multer');
var fs = require('fs');



var storage = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, 'public/img')
    },
    filename:function(req, file, callback){
        callback(null, file.fieldname + '-' + Date.now() + "." + file.mimetype.split('/')[1])
    }
});



var fileFilter = function(req, file, cb) {
    console.log('filefilter called');

    req.filecheck = true;

    var id = req.body.id,
        email = req.body.email;

    var checkIdQuery = connection.query('SELECT * FROM user WHERE id=?', id ,function(err,rows) {
        if(err) {throw err}

        if(rows.length) {
            req.errorMsg ="id in use";
            return cb(null,false);
        }else {
            var checkEmailQuery = connection.query('SELECT * FROM user WHERE email=?', email, function(err,rows) {
                if(err) {throw err}

                if(rows.length) {
                    req.errorMsg = "email in use";
                    return cb(null,false);
                }

                var filetypes = /.jpeg|.jpg|.png|.gif/g,
                    extname = filetypes.test(path.extname(file.originalname).toLowerCase());

                if (extname) {
                    console.log('pass');
                    return cb(null, true);
                }
                req.errorMsg = "not image";
                cb(null, false);
            })
        }
    })
};




var upload = multer({storage:storage , fileFilter: fileFilter});


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

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


router.get('/', function (req, res) {
    //view template을 사용 안했을때 에러 메세지를 어떻게 보여줄 것인가.
    res.sendFile(path.join(__dirname, '../../public/html/loginPage.html'));
});



router.post('/', upload.single('file'), function(req,res){
    console.log('postcalled');
    var data = req.body,
        id = data.id,
        password = data.password,
        email = data.email;

    if(req.filecheck){
        console.log("line 111 called");
        if(!req.errorMsg) {

            var sql = {
                'id': id,
                'password': password,
                'email': email,
                'img': req.file.path.replace(/public/,"..")
            };

            console.log(sql);

            var saveQuery = connection.query('INSERT INTO user SET ?', sql, function (err, rows) {
                if (err) {
                    throw new Error("error while saving")
                }
                else {
                    res.send("signup success")
                }
            })
        }

        else{
            res.send(req.errorMsg);
        }

    }else if(!req.filecheck) {
        var sql = {
            'id': id,
            'password': password,
            'email': email,
            'img': undefined
        };

        var checkIdQuery = connection.query('SELECT * FROM user WHERE id=?', id ,function(err,rows){
            if(err){throw err}

            if(rows.length) {
                res.send("id in use");
            }else{
                var checkEmailQuery = connection.query('SELECT * FROM user WHERE email=?', email, function(err,rows) {
                    if(err){throw err}

                    if(rows.length){
                        res.send("email in use")
                    }else{
                        var saveQuery = connection.query('INSERT INTO user SET ?', sql, function (err, rows) {
                            if(err){throw err}

                            res.send("signup success")
                        })
                    }
                })
            }
        })
    }



});

module.exports = router;

/*const sql = {'id': id, 'password': password, 'email': email};
 const saveQuery = connection.query('insert into user set ?', sql, function(err,rows){
 if(err) {throw new Error("error while saving")}
 else{res.send("signup success");}
 })*/
