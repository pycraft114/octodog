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
            const that = this;
            data['id'] = this.loginId.value;
            data['password'] = this.loginPassword.value;

            sendAjax("POST","/login",data,"application/json",function(){
                switch(this.responseText){
                    case "incorrect password":
                        that.changeAttribute(that.warningListNode, "innerHTML", that.warningMessage.wrongPassword);
                        break;
                    case "user not found":
                        that.changeAttribute(that.warningListNode, "innerHTML", that.warningMessage.noUser);
                        break;
                    case "login success":
                        that.changeAttribute(that.warningListNode, "innerHTML", that.warningMessage.loginSuccess);
                        window.location.href = "/";
                        break;
                    default:
                        console.log("switch called");
                }
            })
        }
    }.bind(loginPage));

    const signUpModalContent = {
        signUpId : $("#signup-id"),
        signUpPassword : $("#signup-password"),
        signUpConfirm : $("#signup-confirm"),
        signUpEmail : $("#signup-email"),
        warningListNode : $("#modal-warning ul"),
        submitButton : $("#submit"),
        warningMessage : {
            noContent: "<li>내용을 입력하세요</li>",
            wrongPassword: "<li>비밀번호가 일치하지 않습니다.</li>",
            sameUser: "<li>이미 사용중인 아이디 입니다.</li>",
            sameEmail: "<li>이미 사용중인 이메일 입니다.</li>"
        }
    };
    const signUpModal = new Page(signUpModalContent);



    signUpModal.submitButton.addEventListener("click",function(evt){

    }.bind(signUpModal));


    octoDog.loginPage = loginPage;

    return octoDog;
}();