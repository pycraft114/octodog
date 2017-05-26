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

router.post('/', function(req, res){
	var query = "insert into scoreboard set ?";
	var sql = {uid:req.body.uid, score:req.body.score};
	connection.query(query, sql, function(err){
		if(err) throw err;
		return;
	});
});

module.exports = router;