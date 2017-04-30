document.addEventListener("DOMContentLoaded", function(){

  function $(element){
    return document.querySelector(element);
  }
  function _$(element){
    return document.querySelectorAll(element);
  }

  $(".btn").addEventListener("click",function(){
    util.sendAjax("post", 'http://localhost:3000/game', "search");
  })

  let util = {
    // chart part Ajax request
     sendAjax : function(method, url, expression, data) {
        const oReq = new XMLHttpRequest();
        let result;

        oReq.open(method, url);
        oReq.setRequestHeader('Content-Type', "application/json");
        if(data!==undefined){
            data =  JSON.stringify(data);
            oReq.send(data);
        }else{
            oReq.send();
        }

        oReq.addEventListener('load', function() {
            result = JSON.parse(oReq.responseText);
            switch (expression) {
              case "search" :
              console.log(result)
              break;
              default:
            }
        }.bind(this))
    },

    search : function(){

    }
  }


});
