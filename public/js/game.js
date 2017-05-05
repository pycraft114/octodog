  function $(element){
    return document.querySelector(element);
  }
  function $$(element){
    return document.querySelectorAll(element);
  }

  function Rank(){
      this.wrap =  $(".rank-wrap");
  }

  Rank.prototype = {
    rankRender : function(result){
      let uid = result.uid;
      let score =  result.score;
      let eventBtn = `<div class="load-wrap"><p class="rank-load">랭킹 더보기<p><div>`;
      let resultHtml = "";
      
      for(let i =0; i < uid.length; i++){
        let template = `<div class="rank">
                  <ul>
                    <li class="numbering">${i}</li>
                    <li class="rank-img"><img src="../img/profile_img1.jpg" alt=""></li>
                    <li class="name"><p>${uid[i]}</p></li>
                    <li class="score"><p>${score[i]}</p></li>
                  </ul>
                  </div>`;
        resultHtml += template;
      }
      resultHtml += eventBtn;
      this.wrap.innerHTML = resultHtml;

      let load =  $(".rank-load");
      load.addEventListener("click", this.rankLoadHandler);
    },

    rankLoadHandler : function(){
      console.log("click");
    }
  };

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
                rank.rankRender(result);
              break;
              default:
            }
        }.bind(this));
    },
  };

  const rank =  new Rank();

document.addEventListener("DOMContentLoaded", function(){

  util.sendAjax("post", 'http://localhost:3000/game', "rankRender");

});
