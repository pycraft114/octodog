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
  database: 'octodog'
})
connection.connect();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../public/html/profile.html'));
})

module.exports = router;
