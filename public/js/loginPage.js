/**
 * Created by chanwoopark on 2017. 4. 22..
 */
document.addEventListener("DOMContentLoaded",function(){
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
        this.signUpButton.addEventListener("click",this.openModalPage.bind(this));

    }

    LoginPage.prototype = {
        openModalPage : function(){
            this.modal.style.display = "block";
        }
    };

    function SignUpModal(){
        this.modal = $("#modal");
        this.signUpId = $("#signup-id");
        this.signUpPassword = $("#signup-password");
        this.signUpConfirm = $("#signup-confirm");
        this.signUpEmail = $("#signup-email");
        this.warningListNode = $("#warning-list").firstChild;
        this.submitButton = $("#submit")

        this.modal.addEventListener("click",this.closeModalPage.bind(this))
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
                
            }
        }
    };

    var loginPage = new LoginPage();
    var signUpModal = new SignUpModal();
});