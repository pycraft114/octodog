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
                    data = JSON.stringify(data);
                    sendAjax("put", "/profile/User/pw", data, "application/json", function () {
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
                    setTimeout(function () {
                        alert("비밀번호가 변경되었습니다!");
                    }, 100);
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
                let data = {};
                data['pw1'] = this.modalPw.value;
                data['pw2'] = this.modalChangePw.value;
                data = JSON.stringify(data);

                sendAjax("post", "/profile/User/confirm", data, "application/json", function () {
                    modalPage.ajaxResponseHandler(modalPage.verifier.bind(modalPage), this.responseText);
                });
            }
        }.bind(modalPage));
    }

    const imgModal = {
        imgModal: $('#imgModal'),
        btnClose: $("#img-modal-close"),
        btnSubmit: $("#change-image-btn"),
        imgInput: $("#change-image"),

        verifier: function (responseText) {
            responseText = JSON.parse(responseText);
            let msg = responseText.msg

            const cases = {
                "change ok": function () {
                    profilePage.imgModal.style.display = "none";
                    setTimeout(function () {
                        alert("사진이 변경되었습니다!");
                    }, 100);
                    sendAjax("get", "/profile/User/left", null, "application/json", function () {
                        profilePage.ajaxResponseHandler(profilePage.leftSideRender.bind(profilePage), this.responseText);
                    });
                },
                "change error": function () {
                    profilePage.imgModal.style.display = "none";
                    setTimeout(function () {
                        alert("사진 변경이 실패 했습니다!");
                    }, 100);
                },
                default: function () {
                    console.log("modal verifier called");
                }
            };
            (cases[msg].bind(this) || cases["default"])();
        }
    };

    const imgModalPage = new SubmitPage(imgModal);

    imgModalPage.btnClose.addEventListener("click", function () {
        this.imgModal.style.display = "none";
    }.bind(imgModalPage));

    imgModalPage.btnSubmit.addEventListener("click", function () {
        let formData = new FormData();
        formData.append('file', this.imgInput.files[0]);
        console.log(formData.file);

        sendAjax('POST', '/profile/User/img', formData, null, function () {
            imgModalPage.ajaxResponseHandler(imgModal.verifier.bind(imgModal), this.responseText);
        });
    }.bind(imgModalPage));

    const profilePageContent = {
        modal: $('#myModal'),
        imgModal: $('#imgModal'),
        leftContent: $(".left")
    };

    //initiate loginPage
    const profilePage = new SubmitPage(profilePageContent);

    profilePage.onBtnEvent = function () {
        let btnPw = $(".pw-change");
        let btnImg = $(".img-change");
        btnPw.addEventListener("click", function () {
            profilePage.modal.style.display = "block";
        });
        btnImg.addEventListener("click", function () {
            profilePage.imgModal.style.display = "block";
        });
    };

    profilePage.leftSideRender = function (responseText) {
        this.leftContent.innerHTML = responseText;
        this.onBtnEvent();
    };

    profilePage.rightSideRender = function (chartObj, resultData) {
        resultData = JSON.parse(resultData);

        let score = resultData.chartscore.reverse(),
            dataSets = chartObj.data.datasets[0],
            comp_data = dataSets.data;

        for (let i = 0; i < comp_data.length; i++) {
            comp_data[i] = score[i];
        }

        dataSets.data = comp_data;
        myBarChart.update();
    };

    const headerContent = {
        headerTag: $("#header")
    };

    const header =  new SubmitPage(headerContent);

    header.renderHeader = function (responseText) {
        template = responseText;
        header.headerTag.innerHTML = template;
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
        sendAjax("get", "/game/header", null, "application/json", function () {
            header.ajaxResponseHandler(header.renderHeader.bind(header), this.responseText);
        });
        sendAjax("get", "/profile/User/right", null, "application/json", function () {
            profilePage.ajaxResponseHandler(profilePage.rightSideRender.bind(profilePage, chartData), this.responseText);
        });
        sendAjax("get", "/profile/User/left", null, "application/json", function () {
            profilePage.ajaxResponseHandler(profilePage.leftSideRender.bind(profilePage), this.responseText);
        });
    });

}();