var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var options = require('../option');
var mysql = require('mysql');

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
})
connection.connect();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../public/html/profile.html'));
})

router.post('/user', function(req, res){
  var responseData = {};
  var query = 'select `email`,`id`,`img` from user where id="ma";' +
      'select score from scoreboard where uid="ma" ORDER BY num DESC limit 5;' +
      'select count(*) from scoreboard where score=125;';

  connection.query(query, function(err,rows){
    responseData = {
      result:"",
      user:{},
      chartscore:[]
    };
    if(err) throw err;

    // user 데이터 처리
    responseData.user =  rows[0];

    // chart에 사용될 score 데이터 처리
    rows[1].forEach(function(val){
      responseData.chartscore.push(val.score);
    })
    var sum = responseData.chartscore.reduce(function(a,b){
      return a+b;
    })
    console.log(sum);

    res.json(responseData);
  });
});

module.exports = router;
