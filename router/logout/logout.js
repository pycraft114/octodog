/**
 * Created by chanwoopark on 2017. 5. 12..
 */
var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res){
    req.logout();
    res.redirect('/login');
});

module.exports = router;