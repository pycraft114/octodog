  function $(element){
    return document.querySelector(element);
  }
  function $$(element){
    return document.querySelectorAll(element);
  }

  function Rank(){
      this.wrap =  $(".rank-list");
      this.load =  $(".rank-load");      
      this.range = {range : 10};
  }

  Rank.prototype = {
    onEvent : function() {
        this.load.addEventListener("click", function(){
        util.sendAjax("post", 'http://localhost:3000/game', "rankRender", rank.range);
      });
    },

    rankRender : function(result){
      let uid = result.uid;
      let score =  result.score;
      let resultHTML = "";
      
      for(let i =0; i < uid.length; i++){
        let template = `<div class="rank">
                  <ul>
                    <li class="numbering">${i+1}</li>
                    <li class="rank-img"><img src="../img/profile_img1.jpg" alt=""></li>
                    <li class="name"><p>${uid[i]}</p></li>
                    <li class="score"><p>${score[i]}</p></li>
                  </ul>
                  </div>`;
        resultHTML += template;
      }
      this.wrap.innerHTML = resultHTML;
      this.range.range += 10;

      
    },
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
  rank.onEvent();
  util.sendAjax("post", 'http://localhost:3000/game', "rankRender", rank.range);

});
