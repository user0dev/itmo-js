/*jslint devel: true */

function les3job4_2() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }
    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptNumber(error) {
        var errorStr = "";
        if (error === true) {
            errorStr = "Ошибка! Не верный ввод!\n";
        }
        return prompt(errorStr + "Программа вычисляет факториал числа\nВведите целое положительное число", "");
    }
    var input, i, num, fac = 1;
    input = promptNumber();
    while (input !== null && !(isIntNumber(input) && input >= 0)) {
        input = promptNumber(true);
    }
    if (input === null) {
        return;
    }
    num = +input;
    for (i = 2; i <= num; i += 1) {
        fac *= i;
    }
    alert(num + "! = " + fac);
}

function les3job4_3() {
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
            errorStr = "Ошибка! Не верный ввод.\n";
        }
        return prompt(errorStr + "Программа выводит числа фибоначчи.\n" +
                      "Ведите колличество чисел\nЭто должно быть целое не отрицательное число", "");
    }
    var input, i, count, arr = [0, 1];
    input = promptNum();
    while (input !== null && !(isIntNumber(input) && input >= 0)) {
        input = promptNum(true);
    }
    if (input === null) {
        return;
    }
    count = +input;
    if (count > 2) {
        for (i = 1; i < count; i += 1) {
            arr.push(arr[i] + arr[i - 1]);
        }
    } else {
        arr.length = count;
    }
    alert("Числа фибоначчи: " + arr.join(" "));
}