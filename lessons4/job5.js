/*jslint devel: true */


function les4job5_1() {
    "use strict";
    function fac(num) {
        if (num < 0) {
            return NaN;
        } else if (num < 2) {
            return 1;
        } else {
            return num * fac(num - 1);
        }
    }
    alert("Факториал 5 = " + fac(5));
}
function les4job5_2() {
    "use strict";
    function reverseNum(num) {
        var s, c;
        s = String(num);
        if (s.length > 1) {
            c = s[0];
            s = s.slice(1);
            return +(reverseNum(s) + c);
        } else if (s.length === 1) {
            return +s;
        } else {
            return NaN;
        }
    }
    alert("153 => " + reverseNum(153));
}

function les4job5_3() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }
    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptNum(error) {
        var errorStr = "";
        if (error === true) {
            errorStr = "Ошибка! Не верный ввод ";
        }
        return prompt(errorStr + "Введите два целых числа больше 0 разделенных пробелом", "");
        
    }
    function isPow(pow, num) {
        if (pow < num) {
            return false;
        }
        if (num === pow) {
            return true;
        } else {
            if (num === 1) {
                return false;
            }
            if (pow % num !== 0) {
                return false;
            } else {
                return isPow(pow / num, num);
            }
        }
    }
    var input, num, pow, arr;
    input = promptNum();
    while (input !== null) {
        arr = input.trim().split(" ");
        if (arr.length === 2 && isIntNumber(arr[0]) && isIntNumber(arr[1]) && arr[0] > 0 && arr[1] > 0) {``
            break;
        }
        input = promptNum(true);
    }
    if (input === null) {
        return;
    }
    pow = +arr[0];
    num = +arr[1];
    if (isPow(pow, num)) {
        alert("Число " + pow + " является степенью числа " + num);
    } else {
        alert("Число " + pow + " не является степенью числа " + num);
    }
}

