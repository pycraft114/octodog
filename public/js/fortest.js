function fortest(a,b){
    console.log(this)
    return a*b
}
var obj = {};

var example = fortest.bind(obj,2)

console.log(example);