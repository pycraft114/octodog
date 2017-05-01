/**
 * Created by chanwoopark on 2017. 4. 22..
 */
document.addEventListener("DOMContentLoaded",function(){
    function sendAjax(method, url, data, type, func) {

        let xhr = new XMLHttpRequest();
        xhr.open(method,url);
        if(type !== undefined) {
            // 타입이 많아지면 switch-case문으로 전환 고려.
            xhr.setRequestHeader("Content-Type", type);
        }

        if(data !== undefined) {
            data = JSON.stringify(data);
            xhr.send(data);
        } else {
            xhr.send();
        }

        xhr.addEventListener("load", func);
    }
//LOCATION.HREF
    function $(selector){
        return document.querySelector(selector)
    }
    function LoginPage(){
        this.modal = $("#modal");
        this.loginId = $("#login-id");
        this.loginPassword = $("#login-password");
        this.loginButton = $("#login");
        this.anonymousButton = $("#anonymous");
        this.signUpButton = $("#signup");
        this.warningListNode = $("#login-warning ul");

        this.signUpButton.addEventListener("click",this.openModalPage.bind(this));
        this.loginButton.addEventListener("click",this.logInButtonClicked.bind(this));
    }

    LoginPage.prototype = {
        openModalPage : function(){
            this.modal.style.display = "block";
        },

        logInButtonClicked : function(){
            let id = this.loginId.value;
            let password = this.loginPassword.value;

            if(id.length === 0 || password.length === 0){
                this.warningListNode.innerHTML = "<li>내용을 입력하세요</li>";
            }else{
                sendAjax("POST","/login")
            }
        }
    };

    function SignUpModal(){
        this.modal = $("#modal");
        this.signUpId = $("#signup-id");
        this.signUpPassword = $("#signup-password");
        this.signUpConfirm = $("#signup-confirm");
        this.signUpEmail = $("#signup-email");
        this.warningListNode = $("#modal-warning ul");
        this.submitButton = $("#submit");

        this.modal.addEventListener("click",this.closeModalPage.bind(this));
        this.submitButton.addEventListener("click",this.sendSignUpInfo.bind(this));
    }

    SignUpModal.prototype = {
        closeModalPage : function(evt){
            if(evt.target === this.modal){
                this.modal.style.display = "none";
            }
        },
        sendSignUpInfo : function(){
            let id = this.signUpId.value;
            let password = this.signUpPassword.value;
            let passwordConfirm = this.signUpConfirm.value;
            let email = this.signUpEmail.value;

            if(id.length === 0 || password.length === 0 || passwordConfirm.length === 0 || email.length === 0){
                this.warningListNode.innerHTML = "<li>내용을 입력하세요</li>"
            }else if(password !== passwordConfirm) {
                this.warningListNode.innerHTML = "<li>비밀번호가 일치하지 않습니다</li>"
            }else{
                let data = {};
                data['signup-id'] = id;
                data['signup-password'] = password;
                data['signup-email'] = email;
                var stringifiedData = JSON.stringify(data);
                sendAjax('POST','/signup',data,'application/json',function(){
                    let modal = $("#modal");
                    let warningListNode = $("#modal-warning ul");
                    console.log(this.responseText);
                    switch(this.responseText){
                        case '["fail-same-id"]' :
                            warningListNode.innerHTML = "<li>ID ALREADY IN USE</li>";
                            break;
                        case '["fail-same-email"]' :
                            warningListNode.innerHTML = "<li>EMAIL ALREADY IN USE</li>";
                            break;
                        case "success-signup" :
                            modal.style.display = 'none';
                            alert("회원가입 완료");
                            break;
                        default :
                            console.log('default');
                    }
                });

            }
        }
    };

    var loginPage = new LoginPage();
    var signUpModal = new SignUpModal();

});

