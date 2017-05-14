const rankResister = function () {

  let $ = util.$,
    $$ = util.$$,
    sendAjax = util.sendAjax;

  const rankPageContent = {
    range: 10,
    load: $(".rank-load"),

    warningMessage: {
      loadError: "LOAD RANKING ERR!"
    },

    verifier: function (responseText) {
      responseText = JSON.parse(responseText);
      let msg = responseText.msg;

      const cases = {
        "ok": function () {
          rankPage.renderRank(responseText);
        },
        "error": function () {
          alert(warningMessage.loadError);
        },
        default: function () {
          console.log("modal verifier called");
        }
      };
      (cases[msg].bind(this) || cases["default"])();
    }
  };

  //initiate loginPage
  const rankPage = new SubmitPage(rankPageContent);

  rankPage.load.addEventListener("click", function () {
    sendAjax("get", "/game/" + rankPage.range, null, "application/json", function () {
      rankPage.ajaxResponseHandler(rankPage.verifier.bind(rankPage), this.responseText);
    });
  });

  rankPage.renderRank = function (responseText) {
    let uid = responseText.uid,
      score = responseText.score,
      template = "",
      wrap = $(".rank-list");

    for (let i = 0; i < uid.length; i++) {
      template += `<div class="rank">
                  <ul>
                    <li class="numbering">${i+1}</li>
                    <li class="rank-img"><img src="../img/profile_img1.jpg" alt=""></li>
                    <li class="name"><p>${uid[i]}</p></li>
                    <li class="score"><p>${score[i]}</p></li>
                  </ul>
                  </div>`;
    }

    wrap.innerHTML = template;
    rankPage.range += 10;
  };


  const headerContent = {
    headerTag: $("#header")
  };

  const header = new SubmitPage(headerContent);

  header.renderHeader = function (responseText){
      template = responseText;
      header.headerTag.innerHTML = template;
  };

  document.addEventListener("DOMContentLoaded", function () {
    sendAjax("get", "/game/header", null, "application/json", function () {
      header.ajaxResponseHandler(header.renderHeader.bind(header), this.responseText);
    });
    sendAjax("get", "/game/" + rankPage.range, null, "application/json", function () {
      rankPage.ajaxResponseHandler(rankPage.verifier.bind(rankPage), this.responseText);
    });
  });

}();