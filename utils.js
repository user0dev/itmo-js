/*jslint devel: true */

var utils = {
    isNumber: function (str) {
        "use strict";
        return str.trim() !== "" && isFinite(str);
    },

    isIntNumber: function (str) {
        "use strict";
        return this.isNumber(str) && (+str === Math.round(str));
    }
};