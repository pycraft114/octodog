var express = require('express');
var app= express();
var path = require('path');
var router = express.Router();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../../public/html/game.html'));
})

module.exports =  router;
