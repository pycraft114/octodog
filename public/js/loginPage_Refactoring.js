/**
 * Created by chanwoopark on 2017. 5. 9..
 */

const octoDog = function(){
    const octoDog = {};

    //const $ = util.$;
    //
    // const sendAjax = util.sendAjax;
    function sendAjax(method, url, data, type, func) {

        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (type) {
            xhr.setRequestHeader("Content-Type", type);
        }

        if (data !== undefined) {
            //data = JSON.stringify(data);
            xhr.send(data);
        } else {
            xhr.send();
        }

        xhr.addEventListener("load", func);
    }

    function $(selector){
        return document.querySelector(selector);
    }

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
        anonymous : $("#anonymous"),
        signUpButton : $("#signup"),
        warningListNode : $("#login-warning ul"),

        warningMessage : {
            noContent: "<li>내용을 입력하세요</li>",
            wrongPassword: "<li>비밀번호가 일치하지 않습니다.</li>",
            noUser: "<li>octoDog의 회원이 아닙니다.</li>",
            loginSuccess: "<li>로그인 완료.</li>"
        },

        verifier : function(responseText){
            const cases = {
                "user not found" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.noUser);
                },
                "incorrect password" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.wrongPassword);
                },
                "login success" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.loginSuccess);
                    location.href = '/game'
                },
                default : function(){
                    console.log("login page verifier called");
                }
            };
            (cases[responseText].bind(this) || cases["default"])();
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
        imgInputTag : $("#signup-image"),
        warningMessage : {
            noContent: "<li>내용을 입력하세요</li>",
            passwordUnconfirm: "<li>비밀번호가 일치하지 않습니다.</li>",
            idInUse: "<li>이미 사용중인 아이디 입니다.</li>",
            emailInUse: "<li>이미 사용중인 이메일 입니다.</li>",
            notImageFile: "<li>이미지 파일을 업로드 해주세요.</li>"
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
                "not image" : function(){
                    this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.notImageFile);
                }
            };
            cases[responseText].bind(this)();
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
                loginPage.ajaxResponseHandler(loginPage.verifier.bind(loginPage), this.responseText);
                //bind안하면 verifier함수내의 this가 window를 가르킴
            })
        }
    }.bind(loginPage));

    loginPage.anonymous.addEventListener("click",function(evt){
        const dummyData = {};
        dummyData['id'] = 'id';
        dummyData['password'] = 'password';
        sendAjax('POST','/anonymous',dummyData,'application/json', function(){
            console.log(this.responseText);
            location.href = '/game';
        });
    }.bind(loginPage));


    modal.submitButton.addEventListener("click",function(evt){
        if(this.checkEmptyInput([this.signUpId,this.signUpPassword,this.signUpConfirm,this.signUpEmail])){
            this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.noContent);
        }else if(this.signUpPassword.value !== this.signUpConfirm.value){
            this.changeAttribute(this.warningListNode, "innerHTML", this.warningMessage.passwordUnconfirm);
        }else {
            let formData = new FormData();
            formData.append('id',this.signUpId.value);
            formData.append('password',this.signUpPassword.value);
            formData.append('email',this.signUpEmail.value);
            formData.append('file',this.imgInputTag.files[0]);
            sendAjax('POST','/signup',formData, null ,function(){
                modal.ajaxResponseHandler(modal.verifier.bind(modal), this.responseText);
                //단순 warning List node inner html 바꾸는 역할 하는 함수랑
                //실질적으로 로그인이나 회원가입 성공했을때 어떤 기능을하는 함수랑 분리
                // 예를 들면 if(this.responseText !== "success") {
                //  modal.changeAttribute(modal.warningListNode, "innerHTML", "<li>"+this.responseText+"</li>");
                // }
                //else 일때는 성공했을때이니 굳이 verifier가 필요없을것같음
                //그런데 이렇게 했을때의 문제점은 success가아닌 각자 개별 상황마다 단순히 warningListNode만 바꾸는게 아니고 다른 기능들을 할때는
                //적용을 할수가없음
                //결론은 verifier가 있어야함
            })
        }
    }.bind(modal));

    //---------------------------------------------------

    octoDog.loginPage = loginPage;
    octoDog.modal = modal;

    return octoDog;
}();

/*
* multer사용 한다 했을때 formdata를 보낼때 stringify 하면 안된다는거랑
* content type을 수동적으로 multipart/form-data로 지정해줄경우 boundary not found라는 오류가 발생한다는것
* formdata는 보낼때 자동적으로 json형태로 보내지는가?
 */