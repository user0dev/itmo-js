/*jslint nomen: true*/
/*jslint devel: true*/

function MyObject(test) {
    "use strict";
    this._test = test;
}

function MyChildObject(test) {
    "use strict";
    MyObject.apply(this, arguments);
    this.showTest = function () {
        alert(this._test);
    };
}

var mco = new MyChildObject("test");
mco.showTest();