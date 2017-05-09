var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var options = require('../option');
var mysql = require('mysql');

var id = "'ma'";

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

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../public/html/profile.html'));
});

router.get('/getUserProfile', function(req, res){
  var responseData = {};
  var temp;
  var query = "select `email`,`id`,`img` from user where id=" + id + ";" +
      "select score from scoreboard where uid=" + id + " ORDER BY num DESC limit 5;" +
      "select count(*) from scoreboard where uid=" + id + ";" +
      "select `score`,(select count(*)+1 from scoreboard where score>t.score) AS rank from scoreboard AS t where `uid`="+ id + " ORDER BY rank asc limit 1;";

  connection.query(query, function(err,rows){
    // user 정보 - email, id, img, play, rank, topscore, totalscore
    responseData = {
      user:{},
      chartscore:[]
    };
    if(err) throw err;

    // user 데이터 처리
    responseData.user =  rows[0][0];

    // chart에 사용될 score 데이터 처리
    rows[1].forEach(function(val){
      responseData.chartscore.push(val.score);
    });

    // 플레이 횟수 처리
    temp = rows[2][0];
    responseData.user.play = temp["count(*)"];

    // 현재 까지 모은 총 score 처리
    var sum = responseData.chartscore.reduce(function(a,b){
      return a+b;
    });
    responseData.user.totalscore = sum;

    // 랭크 처리
    temp = rows[3][0];
    responseData.user.rank = temp.rank;
    responseData.user.topscore = temp.score;


    res.json(responseData);
  });
});

router.put('/updatePW',function(req, res){
  var pw2 = req.body.pw2;
  var query = "update user set password="+ pw2 +" where id="+ id +";";

  connection.query(query, function(err,rows){
    if(err) throw err;
    var responseData = {"msg" : CONFIRM_MESSAGE};
    res.json(responseData);
  });
});

router.post('/confirmUser', function(req, res){
  var pw1 = req.body.pw1;
  var responseData = {};
  
  var query = "select count(*) from user where id=" + id + " AND password="+ pw1 +";"

  connection.query(query, function(err,rows){
    if(err) throw err;
    var confirm = rows[0]["count(*)"];

    if(confirm){
        responseData = {"msg":CONFIRM_MESSAGE};
        res.json(responseData);
    }else{
        responseData = {"msg":ERR_MESSAGE};
        res.json(responseData);
    }

  });

});

module.exports = router;
