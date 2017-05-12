var express =  require('express');
var app = express();
var router = express.Router();
var path = require("path");


// export된 js파일의 경로를 import 함
var profile = require("./profile/profile");
var login = require("./login/login");
var signup = require("./signup/signup");
var game = require("./game/game");
var logout = require("./logout/logout");

// localhost:3000번으로 접근시 default page
router.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "../public/html/main.html"));
  console.log(req.user);
});
// import 된 경로를 라우팅 해준다.
router.use('/profile', profile);
router.use('/signup',signup);
router.use('/login',login);
router.use('/profile', profile);
router.use('/game',game);
router.use('/logout',logout);


module.exports = router;
