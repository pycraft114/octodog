function Page(objectContent){
    for(let key in objectContent){
        this[key] = objectContent[key]
    }
}

const smth = {
    that : this,
    hi : "this is hi"
};

var test = new Page(smth);

console.log(test);