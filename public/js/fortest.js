function fortest(element, attribute, value){
    element[attribute] = value;
}

var a = document.querySelector("#modal");

fortest(a,className,"something");