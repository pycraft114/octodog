var express = require('express');
var app= express();
var path = require('path');
var router = express.Router();
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
});
connection.connect();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../../public/html/game.html'));
});

router.post('/',function(req, res){
  var responseData = {};
  var uid = [];
  var score = [];
  var range = req.body.range;
  var query = "select `score`, `uid`,(select count(*)+1 from scoreboard where score>t.score) AS rank from scoreboard AS t ORDER BY rank asc limit "+range;

  console.log(typeof range, range);
  connection.query(query, function(err,rows){
      for(let i = 0; i < rows.length; i++){
        uid.push(rows[i].uid);
        score.push(rows[i].score);
      }
      responseData.uid = uid;
      responseData.score = score;
      JSON.stringify(responseData);
      res.json(responseData);
  });

});

module.exports =  router;