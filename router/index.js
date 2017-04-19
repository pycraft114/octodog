var express =  require('express')
var app = express();
var router = express.Router();
var path = require("path");
var bodyParser = require("body-parser");

var profile = require("./profile/profile");

router.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "../public/html/main.html"));
})

router.use('/profile', profile);

module.exports = router;
