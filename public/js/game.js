document.addEventListener("DOMContentLoaded", function(){

  function $(element){
    return document.querySelector(element);
  }
  function _$(element){
    return document.querySelectorAll(element);
  }

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
              case "rankRender" :
                this.rankRender(result);
              break;
              default:
            }
        }.bind(this))
    },

    rankRender : function(result){
      let uid = result.uid;
      let score =  result.score;
      let template = $("#rank-template").innerHTML;
      let wrap =  $(".rank-wrap");
      let resultHtml = "";


      for(let i =0; i < uid.length; i++){
        resultHtml += template.replace("{num}",i+1).replace("{name}",uid[i]).replace("{score}",score[i]);
      }
      wrap.innerHTML = resultHtml;
    }
  }

  util.sendAjax("post", 'http://localhost:3000/game', "rankRender");

});
