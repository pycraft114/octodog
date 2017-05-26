const rankResister = function () {

  let $ = util.$,
    $$ = util.$$,
    sendAjax = util.sendAjax;

  const rankPageContent = {
    range: 10,
    load: $(".rank-load"),
    wrap : $(".rank-list"),
  };

  //initiate loginPage
  const rankPage = new SubmitPage(rankPageContent);

  rankPage.load.addEventListener("click", function () {
    sendAjax("get", "/game/" + rankPage.range, null, "application/json", function () {
      rankPage.ajaxResponseHandler(rankPage.renderRank.bind(rankPage), this.responseText);
    });
  });

  rankPage.renderRank = function (responseText) {
      template = responseText;

      this.wrap.innerHTML = template;
      rankPage.range += 10;
  };

  rankPage.renderAfterPostScore = function() {
    rankPage.range = 10;
    sendAjax("get", "/game/" + rankPage.range, null, "application/json", function () {
      rankPage.ajaxResponseHandler(rankPage.renderRank.bind(rankPage), this.responseText);
    });
  };

  rankPage.getUid = function() {
    return rankPage.uid;
  }


  const headerContent = {
    headerTag: $("#header")
    
  };

  const header = new SubmitPage(headerContent);

  header.renderHeader = function (responseText){
      template = responseText;
      header.headerTag.innerHTML = template;

      userId = $(".user-id");
      userId.addEventListener("click", function(){
         sendAjax('POST','/game/User/confirm',null,'application/json',function(){
            header.confirmUser(this.responseText);
         }); 
      });

      
  };

  header.confirmUser = function(responseText){
        let msg = JSON.parse(responseText).msg;
        if(msg==="anonymous"){
          alert("익명 유저는 로그인이 필요합니다");
        }else{
          location.href = "/profile";
        }
  };

  document.addEventListener("DOMContentLoaded", function () {
    sendAjax("get", "/game/header", null, "application/json", function () {
      header.ajaxResponseHandler(header.renderHeader.bind(header), this.responseText);
      rankPage.uid = $(".user-id").innerText;
    });
    sendAjax("get", "/game/" + rankPage.range, null, "application/json", function () {
      rankPage.ajaxResponseHandler(rankPage.renderRank.bind(rankPage), this.responseText);
    });
  });
  return {
    uid: rankPage.getUid,
    renderRank: rankPage.renderAfterPostScore
  };
}();