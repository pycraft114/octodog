
var button = document.querySelector('button');

button.addEventListener("click", function() {
    sendAjax('http://localhost:3000/profile/', "user");
})

function sendAjax(url, direction) {
    var oReq = new XMLHttpRequest();
    var result;

    oReq.open('POST', url + direction);
    oReq.setRequestHeader('Content-Type', "application/json");
    oReq.send();

    oReq.addEventListener('load', function() {
        result = JSON.parse(oReq.responseText);
        console.log(result);
    })
}
