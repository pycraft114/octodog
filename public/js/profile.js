// after loaded event trigger
document.addEventListener("DOMContentLoaded", function(){

function $(element){
  return document.querySelector(element);
}
function _$(element){
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
  // dom componet
  this.modal = $('#myModal');
  this.input = _$(".input-text")
  this.modalPw = $("#Mpw");
  this.modalChangePw = $("#Mrepw");
  this.modalChangePwConfirm = $("#Mrerepw");
  this.warning = $(".warning");
  this.btn_close = $(".close");

  // close button click event
  this.btn_close.addEventListener("click", this.closeClickHandler.bind(this));

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener('click', this.windowClickHandler.bind(this));

  // set event when you press enter key in modal input
  for(let i = 0; i < this.input.length; i++){
    this.input[i].addEventListener("keypress", this.enterEventHandler.bind(this))
  }

}

Modal.prototype = {

  enterEventHandler : function(event){
    let originPw = this.modalPw.value
    let changePw = this.modalChangePw.value
    let changePwConfirm = this.modalChangePwConfirm.value
    let password = {"pw1":originPw, "pw2":changePw};

    if(event.keyCode===13){
        if((originPw==='')||(changePw==='')||(changePwConfirm==='')){
          this.warning.innerHTML = "모든 항목을 입력해주세요"
        }
        else if(changePw!==changePwConfirm){
          this.warning.innerHTML = "비밀 번호 확인이 다릅니다"
        }
        else{
          this.warning.innerHTML = '';
          util.sendAjax("post", 'http://localhost:3000/profile/confirm', "confirm" ,password);
        }
    }
  },

  windowClickHandler:function(event){
    if (event.target == this.modal) {
        this.modal.style.display = "none";
    }
  },

  // When the user clicks on <span> (x), close the modal
  closeClickHandler : function(){
      this.modal.style.display = "none";
      this.modalPw.value='';
      this.modalChangePw.value='';
      this.modalChangePwConfirm.value='';
      this.warning.innerHTML = '';
  }

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
            case "init":
                this.renderBothSide(renderProfile, result);
              break;
            case "confirm":
                this.passwordConfirm(modal, data, result.msg);
              break;
            default:
          }
      }.bind(this))
  },

  renderBothSide : function(obj, result){
    obj.leftSideRender(result);
    obj.rightSideRender(result, chartData);
  },

  passwordConfirm:function(obj, data, msg){
    if(msg==="no"){
      obj.warning.innerHTML = "기존 비밀번호가 잘못 입력되었습니다"
    }
    else{
      let password = JSON.parse(data);
      this.sendAjax("post" ,'http://localhost:3000/profile/change', null , password);
      obj.closeClickHandler();
    }
  }
}



function RenderProfile(){
    this.modal = $('#myModal');
    this.leftContent = $(".left");
    this.template = $("#left-template")
}

RenderProfile.prototype = {
  // left side rendering function
  leftSideRender : function (resultData) {
      let template = this.template.innerHTML;
      let user = resultData.user;
      let chartScore = resultData.chartscore;

      // template 변환 - email, id, img, play, rank, topscore, totalscore
      template = template.replace("{id}", user.id).replace("{email}", user.email).replace("{play}", user.play);
      template = template.replace("{rank}", user.rank).replace("{topscore}", user.topscore).replace("{totalscore}", user.totalscore);

      this.leftContent.innerHTML = template;

      // add button click handler
      // Get the button that opens the modal
      let btn_pw = $(".pw-change");

      btn_pw.addEventListener("click", this.pwClickHandler.bind(this));
  },

  // When the user clicks on the button, open the modal
  pwClickHandler : function(){
      this.modal.style.display = "block";
      console.log("click")
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
}

const renderProfile = new RenderProfile();
const modal = new Modal();
const chartData =  new ChartData()
const myBarChart = new Chart(chartData.ctx, {
    type: 'bar',
    data: chartData.data,
    options: chartData.options
});

    util.sendAjax("post" ,'http://localhost:3000/profile/user', "init");
});
