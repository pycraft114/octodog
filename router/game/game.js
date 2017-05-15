var express = require('express');
var app= express();
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

router.get('/', function(req, res){
  var id = req.user;
  console.log(id);
  if(!id) res.redirect("/login");
  res.sendFile(path.join(__dirname, '../../public/html/game.html'));
});

router.get('/header', function(req, res){
  var id = req.user;
  res.render('header',{'id' : id});
});

router.get('/:searchRankRange',function(req, res){
  var responseData = {msg:CONFIRM_MESSAGE};
  var uid = [];
  var score = [];
  var range = req.params.searchRankRange;
  var query = "select `score`, `uid`,(select count(*)+1 from scoreboard where score>t.score) AS rank from scoreboard AS t ORDER BY rank asc limit "+range;

  connection.query(query, function(err,rows){
      if(err){
        responseData.msg = ERR_MESSAGE;
        res.json(responseData);
      }

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