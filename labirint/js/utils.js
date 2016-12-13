/*global randomInt, isNumber, isIntNumber, randomBool */

//генерация целого случайного числа. min не обязательно, тогда будет от 0 <= r < max
//max невключает. 
function randomInt(max, min) {
    "use strict";
    if (min === undefined) {
        min = 0;
    }
    if (max === undefined) {
        max = 2;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomBool() {
    "use strict";
    return Math.random() >= 0.5;
}

//является ли аргумент числом
function isNumber(str) {
    "use strict";
    return str.trim() !== "" && isFinite(str);
}
//является ли аргумент целым числом
function isIntNumber(str) {
    "use strict";
    return isNumber(str) && (+str === Math.round(str));
}