/*
* 데이터 베이스의 개인 정보를 가져오는 파일 입니다.
* git에 데이터베이스 비밀번호가 올라가면 안되므로 각자 config.json을 만들어주도록 합니다.
* router 폴더 내부에 config.json파일을 만들어
* HOST, user, password 3개의 값을 json 형식으로 입력합니다.
* 이렇게 json 형식으로 받아온 파일을 사용하기 위해서는 js 폴더내부에 require시켜줍니다
* 예) profile 폴더 -> var options = require('../option');
* config.json은 gitignore에 추가 했으므로 별도의 조작은 필요하지 않습니다.
*/

var fs = require('fs'),
configPath = __dirname + '/config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.storageConfig =  parsed;
