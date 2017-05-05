

function $(element){
  return document.querySelector(element);
}
function $$(element){
  return document.querySelectorAll(element);
}

function ChartData(){
  this.ctx = $("#myChart").getContext('2d');

  // chart rendering set object
  this.data = {
      labels: [
          "", "", "", "", "recent"
      ],
      datasets: [
          {
              label: 'Your Score',
              data: [
                  0, 0, 0, 0, 0
              ],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }
      ]
  };

  this.options = {
      animation: {
          animateScale: true
      },
      responsive: false,
      scales: {
          yAxes: [
              {
                  ticks: {
                      beginAtZero: true
                  }
              }
          ]
      }
  };
}

// modal part
function Modal(){
    this.modal = $('#myModal');
    this.input = $$(".input-text");
    this.modalPw = $("#Mpw");
    this.modalChangePw = $("#Mrepw");
    this.modalChangePwConfirm = $("#Mrerepw");
    this.warning = $(".warning");
    this.btn_close = $(".close");

}

Modal.prototype = {

  eventOn : function(){
    // close button click event
    this.btn_close.addEventListener("click", this.closeClickHandler.bind(this));

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', this.windowClickHandler.bind(this));

    // set event when you press enter key in modal input
    for(let i = 0; i < this.input.length; i++){
        this.input[i].addEventListener("keypress", this.enterEventHandler.bind(this));
    }
  },

  enterEventHandler : function(event){
    let originPw = this.modalPw.value;
    let changePw = this.modalChangePw.value;
    let changePwConfirm = this.modalChangePwConfirm.value;
    let password = {"pw1":originPw, "pw2":changePw};

    if(event.keyCode===13){
        if((originPw==='')||(changePw==='')||(changePwConfirm==='')){
          this.warning.innerHTML = "모든 항목을 입력해주세요";
        }
        else if(changePw!==changePwConfirm){
          this.warning.innerHTML = "비밀 번호 확인이 다릅니다";
        }
        else{
          this.warning.innerHTML = '';
          util.sendAjax("post", 'http://localhost:3000/profile/confirm', "confirm" ,password);
        }
    }
  },

  windowClickHandler:function(event){
    if (event.target === this.modal) {
        this.modal.style.display = "none";
    }
  },

  closeClickHandler : function(){
      this.modal.style.display = "none";
      this.modalPw.value='';
      this.modalChangePw.value='';
      this.modalChangePwConfirm.value='';
      this.warning.innerHTML = '';
  }

}

let util = {
    ERR_MESSAGE : "error",
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
            case "init":
                this.renderBothSide(renderProfile, result);
              break;
            case "confirm":
                this.passwordConfirm(modal, data, result.msg);
              break;
            default:
          }
      }.bind(this));
  },

  renderBothSide : function(obj, result){
    obj.leftSideRender(result);
    obj.rightSideRender(result, chartData);
  },

  passwordConfirm:function(obj, data, msg){
      console.log(msg);
    // ERR_MESSAGE로 선언
    if(msg===this.ERR_MESSAGE){
        console.log("nonono");
      obj.warning.innerHTML = "기존 비밀번호가 잘못 입력되었습니다";
    }
    else{
      let password = JSON.parse(data);
      console.log("yes");
      // 변경 실패 고려
      this.sendAjax("post" ,'http://localhost:3000/profile/change', null , password);
      obj.closeClickHandler();
    }
  }
};

// profile render로 이름 변경(생성자는 명사)
// 서버에서 템플릿을 받아온뒤 랜더링
function RenderProfile(){
    this.modal = $('#myModal');
    this.leftContent = $(".left");
}

RenderProfile.prototype = {
  // left side rendering function
  leftSideRender : function (resultData) {
      let user = resultData.user;
      let chartScore = resultData.chartscore;
      let template = `<div class="left-content">
                  <img id="profile-img" src="../img/profile_img1.jpg" width="20%">
                  <div id="id"><h1>${user.id}</h1></div>
                  <div class="user-information">
                      <p>email</p> <div id="email">${user.email}</div>
                      <p>play</p> <div id="play">${user.play}</div>
                      <p>rank</p> <div id="rank">${user.rank}</div>
                      <p>topscore</p> <div id="topscore">${user.topscore}</div>
                      <p>totalscore</p> <div id="totalscore">${user.totalscore}</div>
                  </div>
                  <div class="button-wrap">
                      <button class="btn img-change">프로필사진 변경</button>
                      <button class="btn pw-change">비밀번호 변경</button>
                  </div>
                </div>`;
                
      this.leftContent.innerHTML = template;

      // add button click handler
      // Get the button that opens the modal
      let btn_pw = $(".pw-change");

      btn_pw.addEventListener("click", this.pwClickHandler.bind(this));
  },

  // When the user clicks on the button, open the modal
  pwClickHandler : function(){
      this.modal.style.display = "block";
  },

  // right side rendering function
  rightSideRender : function(resultData, chartObj) {
      let score = resultData.chartscore.reverse();
      let dataSets = chartObj.data.datasets[0];
      let comp_data = dataSets.data;

      for(let i = 0; i < comp_data.length; i++) {
          comp_data[i] = score[i];
      }

      dataSets.data = comp_data;
      myBarChart.update();
  }
};

const renderProfile = new RenderProfile();
const modal = new Modal();
const chartData =  new ChartData();
const myBarChart = new Chart(chartData.ctx, {
    type: 'bar',
    data: chartData.data,
    options: chartData.options
});

// after loaded event trigger
document.addEventListener("DOMContentLoaded", function(){
    modal.eventOn();
    util.sendAjax("post" ,'http://localhost:3000/profile/user', "init");
});
