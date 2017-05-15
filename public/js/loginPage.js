/**
 * Created by chanwoopark on 2017. 4. 22..
 */
/*클로저(이피)사용해서
* 공개할 메소드 말고는 공개하지않기 (전역에 안둔다)
*
* 코드 실질적으로 재사용안되더라도 재사용가능성 확장성(범용성) 테스트 가능성 무조건 확보할것

* */
/*const octo = function(){
    const octo = {}
    octo.a = 1;
    function validate(){
        smth
    }

    function LoginController(){

    }

    octo.logincontroller = new LoginController();

    return octo
}()
*/
document.addEventListener("DOMContentLoaded", function () {
/*    const WARNING_MESSAGES = {
        NO_CONTENT: "<li>내용을 입력하세요</li>",
        WRONG_PASSWORD: "<li>비밀번호가 일치하지 않습니다.</li>",
        NO_USER: "<li>octoDog의 회원이 아닙니다.</li>",
        LOGIN_SUCCESS: "<li>로그인 완료.</li>"
    };

    loginController.attachInput(element, validator, warningmessage) {

    }
    loginController.attachSubmitButton(element, onSubmit) {

    }

    function LoginController() {

    }

    LoginController.prototype.attachInput() =  {
        validate(element.value)
    }
    LoginController.prototyoe.attachSubmit()

*/
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
    //LOCATION.HREF
    function $(selector) {
        return document.querySelector(selector);
    }
    function LoginPage() {
        this.modal = $("#modal");
        this.modalContent = $("#modal-content");
        this.loginId = $("#login-id");
        this.loginPassword = $("#login-password");
        this.loginButton = $("#login");
        this.anonymousButton = $("#anonymous");
        this.signUpButton = $("#signup");
        this.warningListNode = $("#login-warning ul");
        //이벤트 등록하는것 분리
        this.signUpButton.addEventListener("click",this.openModalPage.bind(this));
        this.loginButton.addEventListener("click",this.loginRequest.bind(this));
    }

    LoginPage.prototype = {
        openModalPage : function(){
            this.modal.className = "on";
            this.modalContent.className = "on";
        },

        //변수 사용빈도적으면 함수내에 변수 선언
        loginRequest : function(){
            let id = this.loginId.value;
            let password = this.loginPassword.value;

            if (id.length === 0 || password.length === 0) {
                this.warningListNode.innerHTML = "<li>내용을 입력하세요</li>";
            }else{
                const data = {};
                data['id'] = id;
                data['password'] = password;

                sendAjax("POST","/login",data,'application/json',function(){
                    const warningListNode = $("#login-warning ul");
                    console.log(this.responseText);
                    switch(this.responseText){
                        case "incorrect password":
                            warningListNode.innerHTML = "<li>비밀번호가 일치하지 않습니다.</li>";
                            break;
                        case "user not found":
                            warningListNode.innerHTML = "<li>octoDog의 회원이 아닙니다.</li>";
                            break;
                        case "login success":
                            warningListNode.innerHTML = "<li>로그인 완료.</li>";
                            window.location.href = "/";
                            break;
                        default:
                            console.log("switch called");
                    }
                })
            }
        }
    };

    function SignUpModal() {
        this.modal = $("#modal");
        this.modalContent = $("#modal-content");
        this.signUpId = $("#signup-id");
        this.signUpPassword = $("#signup-password");
        this.signUpConfirm = $("#signup-confirm");
        this.signUpEmail = $("#signup-email");
        this.warningListNode = $("#modal-warning ul");
        this.submitButton = $("#submit");

        this.modal.addEventListener("click", this.closeModalPage.bind(this));
        this.submitButton.addEventListener("click", this.sendSignUpInfo.bind(this));
    }

    SignUpModal.prototype = {
        closeModalPage : function(evt){
            if(evt.target === this.modal){
                this.modal.className = "off";
                this.modalContent.className = "off";
            }
        },
        sendSignUpInfo: function () {
            let id = this.signUpId.value;
            let password = this.signUpPassword.value;
            let passwordConfirm = this.signUpConfirm.value;
            let email = this.signUpEmail.value;

            if(id.length === 0 || password.length === 0 || passwordConfirm.length === 0 || email.length === 0){
                this.warningListNode.innerHTML = "<li>내용을 입력하세요</li>"; //밖으로 뺄것, 로직수정하는일 없도록 , 포커스 인풋에
            }else if(password !== passwordConfirm) {
                this.warningListNode.innerHTML = "<li>비밀번호가 일치하지 않습니다</li>";
            }else{
                const data = {};
                data.id = id;
                data.password = password;
                data.email = email;
                sendAjax('POST','/signup',data,'application/json',function(){
                    const modal = $("#modal");
                    const modalWarning = $("#modal-warning ul");
                    switch(this.responseText){
                        case "아이디 사용중":
                            modalWarning.innerHTML = "<li>이미 사용중인 아이디 입니다.</li>";
                            break;
                        case "이메일 사용중":
                            modalWarning.innerHTML = "<li>이미 사용중인 이메일 입니다.</li>";
                            break;
                        case "회원가입 완료":
                            alert("회원가입이 완료되었습니다.");
                            location.href = '/login';
                            break;
                        default :
                            console.log("switch statement called");
                    }
                });

            }
        }
    };

    var loginPage = new LoginPage();
    var signUpModal = new SignUpModal();
});
/*
function(){
    let id = this.signUpId.value;
    let password = this.signUpPassword.value;
    let passwordConfirm = this.signUpConfirm.value;
    let email = this.signUpEmail.value;

    if(id.length === 0 || password.length === 0 || passwordConfirm.length === 0 || email.length === 0){
        this.warningListNode.innerHTML = "<li>내용을 입력하세요</li>"; //밖으로 뺄것, 로직수정하는일 없도록 , 포커스 인풋에
    }else if(password !== passwordConfirm) {
        this.warningListNode.innerHTML = "<li>비밀번호가 일치하지 않습니다</li>";
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
            //오브젝트 맵핑 스위치문 없애슈
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
*/
