var express =  require('express');
var app = express();
var router = express.Router();
var path = require("path");


// export된 js파일의 경로를 import 함
var profile = require("./profile/profile");
var login = require("./login/login");
var signup = require("./signup/signup");
var postScore = require("./postScore/postScore");
var game = require("./game/game");
var logout = require("./logout/logout");
var anonymous = require("./anonymous/anonymous");

// localhost:3000번으로 접근시 default page
router.get("/", function(req, res){
  res.redirect('/game');
});
// import 된 경로를 라우팅 해준다.
router.use('/profile', profile);
router.use('/signup',signup);
router.use('/login',login);
router.use('/profile', profile);
router.use('/game',game);
router.use('/score', postScore);
router.use('/logout',logout);
router.use('/anonymous',anonymous);


module.exports = router;
