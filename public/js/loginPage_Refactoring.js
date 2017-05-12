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

        verifier : function(responseText){
            console.log(this);
            const self = this;
            const cases = {
                "user not found" : function(){
                    self.changeAttribute(self.warningListNode, "innerHTML", self.warningMessage.noUser);
                },
                "incorrect password" : function(){
                    self.changeAttribute(self.warningListNode, "innerHTML", self.warningMessage.wrongPassword);
                },
                "login success" : function(){
                    self.changeAttribute(this.warningListNode, "innerHTML", self.warningMessage.loginSuccess);
                },
                default : function(){
                    console.log("login page verifier called");
                }
            };
            (cases[responseText] || cases["default"])();
        }
    };

    //initiate loginPage
    const loginPage = new Page(loginPageContent);
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

        verifier : function(responseText){
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
            (cases[responseText].bind(this) || cases["default"])();
        }
    };

    //initiate modal
    const modal = new Page(modalContent);


    //---------------------------------add events-----------------------------

    
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
        //checkemptyinput this 없이 부를수있는방법없나 클로저라서 사라지는경우말고 가져다쓸수있게
        if(this.checkEmptyInput([this.loginId, this.loginPassword])){
            this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.noContent);
        }else {
            const data = {};
            data['id'] = this.loginId.value;
            data['password'] = this.loginPassword.value;
            sendAjax("POST","/login",data,"application/json", function() {
                loginPage.ajaxResponseHandler(loginPage.verifier, this.responseText);
                //bind안하면 verifier함수내의 this가 window를 가르킴
            })
        }
    }.bind(loginPage));


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
                //단순 warning List node inner html 바꾸는 역할 하는 함수랑
                //실질적으로 로그인이나 회원가압 성공했을때 어떤 기능을하는 함수랑 분리
                // 예를 들면 if(this.responseText !== "success") {
                //  modal.changeAttribute(modal.warningListNode, "innerHTML", "<li>"+this.responseText+"</li>");
                // }
                //else 일때는 성공했을때이니 굳이 verifier가 필요없을것같음
                //그런데 이렇게 했을때의 문제점은 success가아닌 각자 개별 상황마다 단순히 warningListNode만 바꾸는게 아니고 다른 기능들을 할때는
                //적용을 할수가없음
                //
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

const octo = {};

(function(octo) {
    function changeAttribute(element, attribute, value){
        element[attribute] = value;
    }

    function isEmpty(element){
        if(element.value.length === 0) {
            return true;
        }

        return false;
    }

    function $(selector){
        return document.querySelector(selector);
    }



    function SubmitPageElement(page, selector) {
        this.page = page;
        this.element = $(selector);
    }

    SubmitPageElement.prototype.onClick = function(clickHandler) {
      this.element.addEventListener("click", clickHandler);
    };

    SubmitPageElement.prototype.addEvent = function(name, eventHandler) {
        const event = new Event(name);

        this.events[name] = event;
        this.element.addEventListener(name, eventHandler, false);
    };

    SubmitPageElement.prototype.necessary = function(isConfirmation, sameSelector) {
        this.page.necessaryInputs.push(this.element);

        if(isConfirmation && this.page[sameSelector]) {
            this.page.confirmationInputs.push(this.element);
            this.page.confirmationInputs.push(this.page[sameSelector]);
        }
    };

    SubmitPageElement.prototype.warningNode = function() {
        this.page.warningNode = this.element;
    };

    SubmitPageElement.prototype.attachSubmit = function(method, url, responseHandler) {
        const page = this.page;

        this.element.addEventListener("click", function() {
            for (const necessaryInput of page.necessaryInputs) {
                if(isEmpty(necessaryInput)) {
                    page.showError("No Content")
                }
            }

            if ((page.confirmationInputs);

        });
    };



    octo.SubmitPage = function(name) {
        this.name = name;
        this.necessaryInputs = [];
        this.confirmationInputs = [];
        this.warningElement = null;
    };

    SubmitPage.init = function(name) {
        return new SubmitPage(name);
    };

    SubmitPage.prototype.addElement = function(name, selector) {
        this[name] = new SubmitPageElement(this, selector);

        return this[name];
    };

    SubmitPage.prototype.addWarningElement = function(selector) {
        this.warningElement = $(selector);
    };

    SubmitPage.prototype.showError = function(message) {
        changeAttribute(this.warningElement, "innerHTML", message)
    }


})(octo);



(function() {
    const modal = octo.SubmitPage.init('loginPage');
    modal.addElement('signUpPassword', '#signup-password')
        .necessary();
    modal.addElement('signUpConfirm', '#signup-confirm')
        .necessary(true, 'signUpPassword');

    modal.addElement('signUpId', '#signup-id')
        .necessary();

    modal.addElement('signUpEmail', '#signup-email')
        .necessary();

    modal.addWarningElement('warningListNode', '#modal-warning ul');

    modal.addElement('submitButton', '#submit')
        .attachSubmit(url, );

})()