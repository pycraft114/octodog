var express = require('express');
var app = express();
var router = require("./router/index");  // 라우팅은 middleware index이 담당하도록 권한을 위임한다.

app.use(express.static('public'));      // 정적 파일 경로 지정
app.use(router);

app.listen(3000,function(){
  console.log("server start on port 3000!");
});
