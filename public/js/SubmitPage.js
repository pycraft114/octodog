const SubmitPage = function(){

    function SubmitPage(objectContent){
        for(let key in objectContent){
            this[key] = objectContent[key];
        }
    }

    SubmitPage.prototype = {
        changeAttribute: function (element, attribute, value) {
            element[attribute] = value;
        },

        checkEmptyInput: function (arrayOfInputTag) {
            for (let i = 0; i < arrayOfInputTag.length; i++) {
                if (arrayOfInputTag[i].value.length === 0) {
                    return true;
                }
            }
            return false;
        },

        //이렇게하면 switch문 대신에 object리터럴로 인스턴스마다 다른 케이스에 따른 다른 행동이 가능함
        ajaxResponseHandler: function (verifier, responseText) {
            verifier(responseText);
        }
    };

    return SubmitPage;

}();