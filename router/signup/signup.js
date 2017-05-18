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

var upload = multer({storage: storage});

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
    const data = req.body,
          id = data.id,
          password = data.password,
          email = data.email,
          filePath = req.file ? req.file.path.replace(/public/,"..") : undefined;

    const checkIdQuery = connection.query('select * from user where id=?', id, function(err,rows) {
        if(err) {throw new Error("error while checking id")}

        if(rows.length) {
            res.send("id in use")
        }else {
            const checkEmailQuery = connection.query('select * from user where email=?', email, function(err,rows) {
                if(err) {throw new Error("error while checking email")}

                if(rows.length) {
                    res.send("email in use");
                }else{
                    const sql = {'id': id, 'password': password, 'email': email, 'img' : filePath};
                    const saveQuery = connection.query('insert into user set ?', sql, function(err,rows){
                        if(err) {throw new Error("error while saving")}
                        else{res.send("signup success")}
                    })
                }
            })
        }
    })
});

module.exports = router;

