const Profile = function () {

    let $ = util.$,
        $$ = util.$$,
        sendAjax = util.sendAjax;

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

    const modalPageContent = {
        modal: $('#myModal'),
        input: $$(".input-text"),
        modalPw: $("#Mpw"),
        modalChangePw: $("#Mrepw"),
        modalChangePwConfirm: $("#Mrerepw"),
        warning: $(".warning"),
        btnClose: $(".close"),

        warningMessage: {
            noContent: "<span>내용을 입력하세요</span>",
            passwordUnconfirm: "<span>비밀번호 확인이 일치하지 않습니다.</span>",
            noUser: "<span>비밀번호가 잘못되었습니다</span>",
            failChange: "<span>비밀번호 변경이 실패 했습니다.</span>"
        },

        verifier: function (responseText) {
            responseText = JSON.parse(responseText);
            let msg = responseText.msg,
                data = responseText.data;

            const cases = {
                "ok": function () {
                    sendAjax("put", "/profile/updatePW", data, "application/json", function () {
                        modalPage.ajaxResponseHandler(modalPage.verifier.bind(modalPage), this.responseText);
                    });
                },
                "error": function () {
                    this.changeAttribute(this.warning, "innerHTML", this.warningMessage.noUser);
                },
                "change ok": function () {
                    this.modal.style.display = "none";
                    this.modalPw.value = '';
                    this.modalChangePw.value = '';
                    this.modalChangePwConfirm.value = '';
                    this.warning.innerHTML = '';
                },
                "change error": function () {
                    this.changeAttribute(this.warning, "innerHTML", this.warningMessage.failChange);
                },
                default: function () {
                    console.log("modal verifier called");
                }
            };
            (cases[msg].bind(this) || cases["default"])();
        }
    };

    //initiate loginPage
    const modalPage = new SubmitPage(modalPageContent);

    modalPage.btnClose.addEventListener("click", function () {
        this.modal.style.display = "none";
        this.modalPw.value = '';
        this.modalChangePw.value = '';
        this.modalChangePwConfirm.value = '';
        this.warning.innerHTML = '';
    }.bind(modalPage));

    window.addEventListener('click', function (event) {
        if (event.target === this.modal) {
            this.modal.style.display = "none";
        }
    }.bind(modalPage));

    for (let i = 0; i < modalPage.input.length; i++) {
        modalPage.input[i].addEventListener("keypress", function (event) {
            if (event.keyCode !== 13) {
                return;
            }

            if (this.checkEmptyInput([this.input[0], this.input[1], this.input[2]])) {
                this.changeAttribute(this.warning, "innerHTML", this.warningMessage.noContent);
            } else if (this.input[1].value !== this.input[2].value) {
                this.changeAttribute(this.warning, "innerHTML", this.warningMessage.passwordUnconfirm);
            } else {
                const data = {};
                data['pw1'] = this.modalPw.value;
                data['pw2'] = this.modalChangePw.value;

                sendAjax("post", "/profile/confirmUser", data, "application/json", function () {
                    modalPage.ajaxResponseHandler(modalPage.verifier.bind(modalPage), this.responseText);
                });
            }
        }.bind(modalPage));
    }


    const profilePageContent = {
        modal: $('#myModal'),
        leftContent: $(".left"),

        warningMessage: {
            loadError: "LOAD RANKING ERR!"
        },

        verifier: function (responseText) {
            responseText = JSON.parse(responseText);
            let msg = responseText.msg;

            const cases = {
                "ok": function () {
                    profilePage.leftSideRender(responseText);
                    profilePage.rightSideRender(responseText, chartData);
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
    const profilePage = new SubmitPage(profilePageContent);

    profilePage.onBtnEvent =  function(){
        let btnPw = $(".pw-change");
        btnPw.addEventListener("click", function () {
            profilePage.modal.style.display = "block";
        });
    };

    profilePage.leftSideRender = function (resultData) {
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
    };

    profilePage.rightSideRender = function (resultData, chartObj) {
        let score = resultData.chartscore.reverse(),
            dataSets = chartObj.data.datasets[0],
            comp_data = dataSets.data;

        for (let i = 0; i < comp_data.length; i++) {
            comp_data[i] = score[i];
        }

        dataSets.data = comp_data;
        myBarChart.update();
    };

    // const profileRender = new ProfileRender();
    const chartData = new ChartData();
    const myBarChart = new Chart(chartData.ctx, {
        type: 'bar',
        data: chartData.data,
        options: chartData.options
    });

    // after loaded event trigger
    document.addEventListener("DOMContentLoaded", function () {
        sendAjax("get", "/profile/getUserProfile", null, "application/json", function () {
            profilePage.ajaxResponseHandler(profilePage.verifier.bind(profilePage), this.responseText);
        });
    });

}();