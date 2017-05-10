/**
 * Created by chanwoopark on 2017. 5. 9..
 */

const octoDog = function(){
    const octoDog = {};

    function ajaxResponseHandler(ajaxResponse) {

    }

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
    //validateRrors의 재사용성을 고려한것.
    responseErrors = {
        INCORRECT_PASSWORD: "incorrect_password"
    }

    function $(selector){
        return document.querySelector(selector);
    }
    //---------------------closure----------------------------선언 순서 (?)

    /*
    // validate 함수는(리턴 트루 폴스 해서 트루폴스값에따른 체인지 어트리뷰트를 하는 또다른 함수를 만들어야함) 유효한지 확인만 해야함 다른 작업은 다른함수로
    function ajaxResponseHandler(responseText) {
        switch(responseText){
            case validateErrors.INCORRECT_PASSWORD:
                loginPage.changeAttribute(loginPage.warningListNode, "innerHTML", loginPage.warningMessage.wrongPassword);
                break;
            case "user not found":
                loginPage.changeAttribute(loginPage.warningListNode, "innerHTML", loginPage.warningMessage.noUser);
                break;
            case "login success":
                loginPage.changeAttribute(loginPage.warningListNode, "innerHTML", loginPage.warningMessage.loginSuccess);
                window.location.href = "/";
                break;
            case "already used id" :
                modal.changeAttribute(modal.warningListNode, "innerHTML", modal.warningMessage.idInUse);
                break;
            case "already used email":
                modal.changeAttribute(modal.warningListNode, "innerHTML", modal.warningMessage.emailInUse);
                break;
            case "signup success":
                alert("회원가입이 완료되었습니다.");
                location.href = '/login';
                break;
            default:
                console.log("switch called");
        }
    }
    */

    //-------------------Page class---------------------------
    function Page(objectContent){
        for(let key in objectContent){
            this[key] = objectContent[key]
        }
    }

    /*비교할 case들도 argument로 받아서 더 generic하게 만들고싶음
    94번라인참조
    Page.prototype.ajaxResponseHandler(element, resposeText, message ) {
        this.
    }
    */

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

        //이렇게하면 switch문 대신에 object리터럴로 인스턴스마다 다른 케이스에 따른 다른 행동이 가능함
        ajaxResponseHandler : function(verifier, responseText){
            verifier(responseText);
        }

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

        //31번라인의 키이름과 warning message 키이름 동일하게해볼것
        warningMessage : {
            noContent: "<li>내용을 입력하세요</li>",
            wrongPassword: "<li>비밀번호가 일치하지 않습니다.</li>",
            noUser: "<li>octoDog의 회원이 아닙니다.</li>",
            loginSuccess: "<li>로그인 완료.</li>"
        },

        verifier : function(responseType){
            const cases = {
                "user not found" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.noUser);
                },
                "incorrect password" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.wrongPassword);
                },
                "login success" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.loginSuccess);
                },
                default : function(){
                    console.log("login page verifier called");
                }
            };
            (cases[responseType].bind(this) || cases["default"])();
        }
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
            sendAjax("POST","/login",data,"application/json", function() {
                loginPage.ajaxResponseHandler(loginPage.verifier.bind(loginPage), this.responseText);
                                                                //bind안하면 verifier함수내의 this가 window를 가르킴
            })
        }
    }.bind(loginPage));
    //-------------------------------------------------------

    //------------------------modal---------------------------
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
        },

        verifier : function(responseType){
            const cases = {
                "id in use" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.idInUse);
                },
                "email in use" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.emailInUse);
                },
                "signup success" : function(){
                    alert("회원가입이 완료되었습니다.");
                    location.href = '/login';
                },
                default : function(){
                    console.log("modal verifier called");
                }
            };
            (cases[responseType].bind(this) || cases["default"])();
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
                modal.ajaxResponseHandler(modal.verifier.bind(modal), this.responseText);
            })
        }
    }.bind(modal));

    //---------------------------------------------------

    octoDog.loginPage = loginPage;
    octoDog.modal = modal;

    return octoDog;
}();

/*
sumitPage

submitPage.prototype.addElement(이름, 셀렉터) {
    this['이름'] = $셀렉터

    retun this
}

Page.prototype.onClick(name, handlingFunction)
Page.prototype.onSubmit(name, handlingFunction)
Page.prototype.createEvent(error)
Page.prototype.onEvent(name, handlingFunction)
Page.prototype.onSuccess()

loginPage = new Page('loginPage')
modalPage = new Page('modalPage')

loginPage.addElement('warning', '#warning')
    .onError('warning', (message) {
case "아이디 사용중" :
    modal.changeAttribute(modal.warningListNode, "innerHTML", modal.warningMessage.idInUse);
    break;
case "이메일 사용중":
    modal.changeAttribute(modal.warningListNode, "innerHTML", modal.warningMessage.emailInUse);
    break;
})
*/


