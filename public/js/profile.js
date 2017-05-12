const Profile = function () {

    let $ = util.$,
        $$ = util.$$,
        sendAjax = util.sendAjax;

    function isEmpty(data, changeHTML) {
        let password = {
                "pw1": data.originPw,
                "pw2": data.changePw
            };

        if ((data.originPw === '') || (data.changePw === '') || (data.changePwConfirm === '')) {
            changeHTML.innerHTML = "모든 항목을 입력해주세요";
        } else if (data.changePw !== data.changePwConfirm) {
            changeHTML.innerHTML = "비밀 번호 확인이 다릅니다";
        } else {
            changeHTML.innerHTML = '';
            sendAjax("post", 'http://localhost:3000/profile/confirmUser', password, "application/json", modal.passwordConfirm);
        }
    }

    function ChartData() {
        this.ctx = $("#myChart").getContext('2d');

        // chart rendering set object
        this.data = {
            labels: [
                "", "", "", "", "recent"
            ],
            datasets: [{
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
            }]
        };

        this.options = {
            animation: {
                animateScale: true
            },
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
    }

    // modal part
    function Modal() {
        this.modal = $('#myModal');
        this.input = $$(".input-text");
        this.modalPw = $("#Mpw");
        this.modalChangePw = $("#Mrepw");
        this.modalChangePwConfirm = $("#Mrerepw");
        this.warning = $(".warning");
        this.btn_close = $(".close");

    }

    Modal.prototype = {

        eventOn: function () {
            // close button click event
            this.btn_close.addEventListener("click", this.closeBtnClickHandler.bind(this));

            // When the user clicks anywhere outside of the modal, close it
            window.addEventListener('click', this.windowClickHandler.bind(this));

            for (let i = 0; i < this.input.length; i++) {
                this.input[i].addEventListener("keypress", this.enterPressEventHandler.bind(this));
            }
        },

        enterPressEventHandler: function (event) {
            let passwordObj = {
                originPw: this.modalPw.value,
                changePw: this.modalChangePw.value,
                changePwConfirm: this.modalChangePwConfirm.value
            };

            if (event.keyCode === 13) {
                isEmpty(passwordObj, this.warning);
            }
        },

        windowClickHandler: function (event) {
            if (event.target === this.modal) {
                this.modal.style.display = "none";
            }
        },

        closeBtnClickHandler: function () {
            this.modal.style.display = "none";
            this.modalPw.value = '';
            this.modalChangePw.value = '';
            this.modalChangePwConfirm.value = '';
            this.warning.innerHTML = '';
        },

        passwordConfirm: function () {
            let result = JSON.parse(this.responseText),
                msg = result.msg,
                ERR_MESSAGE = "error",
                originPw = modal.modalPw.value,
                changePw = modal.modalChangePw.value,
                password = {
                    "pw1": originPw,
                    "pw2": changePw
                };

            // ERR_MESSAGE로 선언
            if (msg === ERR_MESSAGE) {
                modal.warning.innerHTML = "기존 비밀번호가 잘못 입력되었습니다";
            } else {
                // 변경 실패 고려
                sendAjax("put", 'http://localhost:3000/profile/updatePW', password, "application/json");
                modal.closeBtnClickHandler();
            }
        }
    }



    function ProfileRender() {
        this.modal = $('#myModal');
        this.leftContent = $(".left");
    }

    ProfileRender.prototype = {
        onBtnEvent: function () {
            // Get the button that opens the modal
            let btn_pw = $(".pw-change");

            btn_pw.addEventListener("click", this.pwClickHandler.bind(this));
        },

        renderBothSide: function (result) {
            result = JSON.parse(this.responseText);
            profileRender.leftSideRender(result);
            profileRender.rightSideRender(result, chartData);
        },

        // left side rendering function
        leftSideRender: function (resultData) {
            let user = resultData.user,
                chartScore = resultData.chartscore,
                template = `<div class="left-content">
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
            this.onBtnEvent();
        },

        // right side rendering function
        rightSideRender: function (resultData, chartObj) {
            let score = resultData.chartscore.reverse(),
                dataSets = chartObj.data.datasets[0],
                comp_data = dataSets.data;

            for (let i = 0; i < comp_data.length; i++) {
                comp_data[i] = score[i];
            }

            dataSets.data = comp_data;
            myBarChart.update();
        },

        // When the user clicks on the button, open the modal
        pwClickHandler: function () {
            this.modal.style.display = "block";
        }
    };

    const profileRender = new ProfileRender();
    const modal = new Modal();
    const chartData = new ChartData();
    const myBarChart = new Chart(chartData.ctx, {
        type: 'bar',
        data: chartData.data,
        options: chartData.options
    });

    // after loaded event trigger
    document.addEventListener("DOMContentLoaded", function () {
        modal.eventOn();
        sendAjax("get", 'http://localhost:3000/profile/getUserProfile', null, "application/json", profileRender.renderBothSide);
    });

    return {
        modal: modal,
        profileRender : profileRender
    };
}();
