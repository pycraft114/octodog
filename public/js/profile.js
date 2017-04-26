// after loaded event trigger
document.addEventListener("DOMContentLoaded", function(){

function $(element){
  return document.querySelector(element);
}
function _$(element){
  return document.querySelectorAll(element);
}

function ChartView(){
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

var chartView =  new ChartView()


var myBarChart = new Chart(chartView.ctx, {
    type: 'bar',
    data: chartView.data,
    options: chartView.options
});

// modal part
// Get the modal,
function modal(){
  this.modal = $('#myModal');
  this.input = _$(".input-text")
  this.modalPw = $("#Mpw");
  this.modalChangePw = $("#Mrepw");
  this.modalChangePwConfirm = $("#Mrerepw");
  this.warning = $(".warning");
}
var modal = document.getElementById('myModal');

// When the user clicks on the button, open the modal
function pwClickHandler(){
    modal.style.display = "block";
    console.log("click")
}

// When the user clicks on <span> (x), close the modal
function closeClickHandler(){
    modal.style.display = "none";
    modalPw.value='';
    modalChangePw.value='';
    modalChangePwConfirm.value='';
    warning.innerHTML = '';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// chart part Ajax request
function sendAjax(url, expression, data) {
    var oReq = new XMLHttpRequest();
    var result;

    oReq.open('POST', url);
    oReq.setRequestHeader('Content-Type', "application/json");
    if(data!==undefined){
        var data = {'password' : data};
        data =  JSON.stringify(data);
        oReq.send(data);
    }else{
        oReq.send();
    }

    oReq.addEventListener('load', function() {
        result = JSON.parse(oReq.responseText);
        switch (expression) {
          case "init":
            leftSideRender(result);
            rightSideRender(result);
            break;
          case "confirm":
            if(result.msg==="no"){
              warning.innerHTML = "기존 비밀번호가 잘못 입력되었습니다"
            }
            else{
              var password = JSON.parse(data).password;
              sendAjax('http://localhost:3000/profile/change', null , password);
              closeClickHandler();
            }
            console.log(result);
            break;
          default:

        }

    })
}

// left side rendering function
function leftSideRender(resultData) {
    var template = document.getElementById("left-template").innerHTML;
    var leftContent = document.querySelector(".left");
    var user = resultData.user;
    var chartScore = resultData.chartscore;

    // template 변환 - email, id, img, play, rank, topscore, totalscore
    template = template.replace("{id}", user.id).replace("{email}", user.email).replace("{play}", user.play);
    template = template.replace("{rank}", user.rank).replace("{topscore}", user.topscore).replace("{totalscore}", user.totalscore);

    leftContent.innerHTML = template;

    // add button click handler
    // Get the button that opens the modal
    var btn_pw = document.getElementsByClassName("pw-change")[0];
    // Get the <span> element that closes the modal
    var btn_close = document.getElementsByClassName("close")[0];

    btn_pw.addEventListener("click", pwClickHandler);
    btn_close.addEventListener("click", closeClickHandler);
}

// right side rendering function
function rightSideRender(resultData) {
    var score = resultData.chartscore.reverse();
    var comp_data = chartView.data.datasets[0].data;

    for (var i = 0; i < comp_data.length; i++) {
        comp_data[i] = score[i];
    }

    chartView.data.datasets[0].data = comp_data;
    myBarChart.update();
}

// modal key press event
var input = document.getElementsByClassName("input-text")
var modalPw = document.getElementById("Mpw");
var modalChangePw = document.getElementById("Mrepw");
var modalChangePwConfirm = document.getElementById("Mrerepw");
var warning = document.getElementsByClassName("warning")[0];


function addEnterEvent(){
  for(var i = 0; i < input.length; i++){
    input[i].addEventListener("keypress", enterEventHandler)
  }
}

function enterEventHandler(event){
  var originPw = modalPw.value
  var changePw = modalChangePw.value
  var changePwConfirm = modalChangePwConfirm.value
  var password = {"pw1":originPw, "pw2":changePw};

  if(event.keyCode===13){
      if((originPw==='')||(changePw==='')||(changePwConfirm==='')){
        warning.innerHTML = "모든 항목을 입력해주세요"
      }
      else if(changePw!==changePwConfirm){
        warning.innerHTML = "비밀 번호 확인이 다릅니다"
      }
      else{
        warning.innerHTML = '';
        sendAjax('http://localhost:3000/profile/confirm', "confirm" ,password);
      }
  }
}


    sendAjax('http://localhost:3000/profile/user', "init");
});
