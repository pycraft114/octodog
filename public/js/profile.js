// 차트 렌더링 설정 객체
var data = {
    labels: [
        "1", "2", "3", "4", "5"
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

var options = {
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

var ctx = document.getElementById("myChart").getContext('2d');
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});

var button = document.querySelector('button');

button.addEventListener("click", function() {
    sendAjax('http://localhost:3000/profile/user');
})

function sendAjax(url) {
    var oReq = new XMLHttpRequest();
    var result;

    oReq.open('POST', url);
    oReq.setRequestHeader('Content-Type', "application/json");
    oReq.send();

    oReq.addEventListener('load', function() {
        result = JSON.parse(oReq.responseText);
        leftSideRender(result);
        rightSideRender(result);
    })
}

// 왼쪽 사이드 렌더링 함수
function leftSideRender(resultData){
  var template = document.getElementById("left-template").innerHTML;
  var leftContent = document.getElementById("left-content");
  var user = resultData.user;
  var chartScore = resultData.chartscore;

  // template 변환 - email, id, img, play, rank, topscore, totalscore
  template = template.replace("{id}",user.id).replace("{email}",user.email).replace("{play}",user.play);
  template = template.replace("{rank}",user.rank).replace("{topscore}",user.topscore).replace("{totalscore}",user.totalscore);

  leftContent.innerHTML = template;
}

// 오른쪽 사이드 렌더링 함수
function rightSideRender(resultData){
  var score = resultData.chartscore;
  var comp_data = data.datasets[0].data;
  console.log(resultData);
  for (var i = 0; i < comp_data.length; i++) {
      comp_data[i] = score[i];
  }

  data.datasets[0].data = comp_data;
  myBarChart.update();
}
