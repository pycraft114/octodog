
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
