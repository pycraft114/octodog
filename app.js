var express = require('express');
var app = express();
var router = express.Router();
var router = require("./router/index")

app.use(express.static('public'));
app.use(router);

app.listen(3000,function(){
  console.log("server start on port 3000!");
})
