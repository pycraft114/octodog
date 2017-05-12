function Util() {
    if(!(this instanceof Util)) { return new Util(); }
}

Util.prototype ={

    $ : function(element) {
        return document.querySelector(element);
    },

    $$ : function(element) {
        return document.querySelectorAll(element);
    },

    sendAjax : function(method, url, data, type, func) {
        const oReq = new XMLHttpRequest();
        let result;

        oReq.open(method, url);
        oReq.setRequestHeader('Content-Type', type);
        if (data !== null) {
            data = JSON.stringify(data);
            oReq.send(data);
        } else {
            oReq.send();
        }

        oReq.addEventListener('load', func);
    }

};

const util = new Util();
