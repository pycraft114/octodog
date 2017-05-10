/**
 * Created by chanwoopark on 2017. 5. 9..
 */

const octoDog = function(){
    const octoDog = {};

    function sendAjax(method, url, data, type, func) {

        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (type !== undefined) {
            // 타입이 많아지면 switch-case문으로 전환 고려.
            xhr.setRequestHeader("Content-Type", type);
        }

        if (data !== undefined) {
            data = JSON.stringify(data);
            xhr.send(data);
        } else {
            xhr.send();
        }

        xhr.addEventListener("load", func);
    }

    function $(selector){
        return document.querySelector(selector);
    }
    //---------------------closure----------------------------선언 순서 (?)

    function validator(type) {
        switch(type){
            case "incorrect password":
                loginPage.changeAttribute(loginPage.warningListNode, "innerHTML", loginPage.warningMessage.wrongPassword);
                break;
            case "user not found":
                loginPage.changeAttribute(loginPage.warningListNode, "innerHTML", loginPage.warningMessage.noUser);
                break;
            case "login success":
                loginPage.changeAttribute(loginPage.warningListNode, "innerHTML", loginPage.warningMessage.loginSuccess);
                window.location.href = "/";
                break;
            case "아이디 사용중" :
                modal.changeAttribute(modal.warningListNode, "innerHTML", modal.warningMessage.idInUse);
                break;
            case "이메일 사용중":
                modal.changeAttribute(modal.warningListNode, "innerHTML", modal.warningMessage.emailInUse);
                break;
            case "회원가입 완료":
                alert("회원가입이 완료되었습니다.");
                location.href = '/login';
                break;
            default:
                console.log("switch called");
        }
    }

    //-------------------Page class---------------------------
    function Page(objectContent){
        for(let key in objectContent){
            this[key] = objectContent[key]
        }
    }

    Page.prototype = {
        changeAttribute : function (element, attribute, value){
            element[attribute] = value;
        },

        checkEmptyInput : function(arrayOfInputTag){
            for(let i = 0; i < arrayOfInputTag.length ; i++){
                if(arrayOfInputTag[i].value.length === 0){
                    return true;
                }
            }
            return false;
        },

    };
    //---------------------------------------------------------
    //-------------------------login page----------------------
    const loginPageContent = {
        modal : $("#modal"),
        modalContent : $("#modal-content"),
        loginId : $("#login-id"),
        loginPassword : $("#login-password"),
        loginButton : $("#login"),
        signUpButton : $("#signup"),
        warningListNode : $("#login-warning ul"),
        warningMessage : {
            noContent: "<li>내용을 입력하세요</li>",
            wrongPassword: "<li>비밀번호가 일치하지 않습니다.</li>",
            noUser: "<li>octoDog의 회원이 아닙니다.</li>",
            loginSuccess: "<li>로그인 완료.</li>"
        },
    };
    const loginPage = new Page(loginPageContent);


    loginPage.signUpButton.addEventListener("click", function(){
        this.changeAttribute(this.modal,"className","on");
        this.changeAttribute(this.modalContent,"className","on");
    }.bind(loginPage));

    loginPage.modal.addEventListener("click",function(evt){
        if(evt.target === this.modal){
            this.changeAttribute(this.modal,"className","off");
            this.changeAttribute(this.modalContent,"className","off");
        }
    }.bind(loginPage));

    loginPage.loginButton.addEventListener("click",function(evt){
        if(this.checkEmptyInput([this.loginId, this.loginPassword])){
            this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.noContent);
        }else {
            const data = {};
            data['id'] = this.loginId.value;
            data['password'] = this.loginPassword.value;
            sendAjax("POST","/login",data,"application/json",function(){
                validator(this.responseText)
            })
        }
    }.bind(loginPage));
    //-------------------------------------------------------


    const modalContent = {
        signUpId : $("#signup-id"),
        signUpPassword : $("#signup-password"),
        signUpConfirm : $("#signup-confirm"),
        signUpEmail : $("#signup-email"),
        warningListNode : $("#modal-warning ul"),
        submitButton : $("#submit"),
        warningMessage : {
            noContent: "<li>내용을 입력하세요</li>",
            passwordUnconfirm: "<li>비밀번호가 일치하지 않습니다.</li>",
            idInUse: "<li>이미 사용중인 아이디 입니다.</li>",
            emailInUse: "<li>이미 사용중인 이메일 입니다.</li>"
        }
    };
    const modal = new Page(modalContent);



    modal.submitButton.addEventListener("click",function(evt){
        if(this.checkEmptyInput([this.signUpId,this.signUpPassword,this.signUpConfirm,this.signUpEmail])){
            this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.noContent);
        }else if(this.signUpPassword.value !== this.signUpConfirm.value){
            this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.passwordUnconfirm);
        }else {
            const data = {};
            data['id'] = this.signUpId.value;
            data['password'] = this.signUpPassword.value;
            data['email'] = this.signUpEmail.value;

            sendAjax('POST','/signup',data,'application/json',function(){
                validator(this.responseText);
            })
        }
    }.bind(modal));


    octoDog.loginPage = loginPage;
    octoDog.modal = modal;

    return octoDog;
}();