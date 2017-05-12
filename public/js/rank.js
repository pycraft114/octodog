const rankResister = function () {

  let $ = util.$,
      $$ = util.$$,
      sendAjax = util.sendAjax;

  function Rank() {
    this.range = 10;
  }

  Rank.prototype = {
    onEvent: function () {
      let load = $(".rank-load");
      load.addEventListener("click", function () {
        sendAjax("get", 'http://localhost:3000/game/' + this.range, null, "application/json", rank.rankRender);
      }.bind(this));
    },

    rankRender: function () {
      let uid = JSON.parse(this.responseText).uid;
      let score = JSON.parse(this.responseText).score;
      let resultHTML = "";
      let wrap = $(".rank-list");

      for (let i = 0; i < uid.length; i++) {
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
      wrap.innerHTML = resultHTML;
      rank.range += 10;
    },
  };

  const rank = new Rank();

  document.addEventListener("DOMContentLoaded", function () {
    rank.onEvent();
    sendAjax("get", 'http://localhost:3000/game/' + rank.range, null, "application/json", rank.rankRender);
  });

  return {
    rank: rank
  };

}();