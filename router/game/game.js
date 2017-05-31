var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
var options = require('../option');
var mysql = require('mysql');

const ERR_MESSAGE = "error";
const CONFIRM_MESSAGE = "ok";

var loginData = {
  host: options.storageConfig.HOST,
  user: options.storageConfig.user,
  password: options.storageConfig.password
};

var connection = mysql.createConnection({
  host: loginData.host,
  port: 3306,
  user: loginData.user,
  password: loginData.password,
  database: 'octodog',
  multipleStatements: true
});

connection.connect();

router.get('/', function (req, res) {
  var id = req.user;
  if (!id) {
    res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, '../../public/html/game.html'));
});

router.get('/header', function (req, res) {
  var id = req.user;
  var img = "../img/profile_img1.jpg";
  var query = "select `img` from user where id='" + id + "';";

  if (id === "anonymous") {
    let random = Math.floor((Math.random() * 1000) + 1);
    id = "개굴#";
    id += random;

    res.render('header', {
    'id': id,
    'img': img
  });
}

  connection.query(query, function(err,rows){
    if((rows[0]!==undefined)&&(rows[0].img!==null)){
      img = rows[0].img;
    }
    res.render('header', {
      'id': id,
      'img': img
    });
  });

  
});

router.get('/:searchRankRange', function (req, res) {
  var templateData = [];
  var range = req.params.searchRankRange;
  var query = "select `id`, `img` from user;"+
            "select `score`, `uid`,(select count(*)+1 from scoreboard where score>t.score) AS rank from scoreboard AS t ORDER BY rank asc limit " + range+ ";";
              

  connection.query(query, function (err, rows) {
    var imgList = {};

    rows[0].forEach(function(val){
      imgList[val.id] = val.img;
    });

    for (let i = 0; i < rows[1].length; i++) {
      let data = {
        num: i + 1,
        uid: rows[1][i].uid,
        score: rows[1][i].score
      };

      if(imgList[data.uid]===null){
        data.img = "../img/profile_img1.jpg";
      }
      else if(imgList[data.uid]===undefined){
        data.img = "../img/flog.png";
      }else{
        data.img = imgList[data.uid];
      }
      
      templateData.push(data);
    }

    res.render('ranklist', {
      'templateData': templateData
    });
  });
});


router.post('/User/confirm', function (req, res) {
  var id = req.user;
  var responseText = {};

  if (id === "anonymous") {
    responseText.msg = "anonymous";
  } else {
    responseText.msg = "comfirm ok";
  }
  res.json(responseText);

});

module.exports = router;