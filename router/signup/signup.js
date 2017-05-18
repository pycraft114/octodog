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



var storage = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, 'public/img')
    },
    filename:function(req, file, callback){
        callback(null, file.fieldname + '-' + Date.now() + "." + file.mimetype.split('/')[1])
    }
});
var inputData = {};

var fileFilter = function(req, file, cb) {
    inputData.data = req.body,
    inputData.id = req.body.id,
    inputData.password = req.body.password,
    inputData.email = req.body.email,
    inputData.filePath = req.file ? req.file.path.replace(/public/,"..") : undefined;

    const checkIdQuery = connection.query('SELECT * FROM user WHERE id=?',inputData.id, function(err,rows) {
        if(err) {throw err}

        if(rows.length) {
            req.errorMsg ="id in use";
            return cb(null,false);
        }else {
            const checkEmailQuery = connection.query('SELECT * FROM user WHERE email=?', inputData.email, function(err,rows) {
                if(err) {throw err}

                if(rows.length) {
                    req.errorMsg = "email in use";
                    return cb(null,false);
                }

                const filetypes = /.jpeg|.jpg|.png|.gif/g,
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


var upload = multer({storage: storage, fileFilter: fileFilter});

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
    if(!req.errorMsg) {
        const sql = {
            'id': inputData.id,
            'password': inputData.password,
            'email': inputData.email,
            'img': inputData.filePath
        };
        const saveQuery = connection.query('INSERT INTO user SET ?', sql, function (err, rows) {
            if (err) {
                throw new Error("error while saving")
            }
            else {
                res.send("signup success")
            }
        })
    }
    else{res.send(req.errorMsg);}
});

module.exports = router;

