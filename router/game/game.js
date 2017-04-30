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
})
connection.connect();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../../public/html/game.html'));
})

router.post('/',function(req, res){
  var responseData = {};
  var query = "select `score`, `uid`,(select count(*)+1 from scoreboard where score>t.score) AS rank from scoreboard AS t ORDER BY rank asc limit 10";

  connection.query(query, function(err,rows){
    console.log(rows);
  })

  JSON.stringify(responseData);
  res.json(responseData);
})

module.exports =  router;
