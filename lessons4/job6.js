/*jslint devel: true */

function les4job6_1() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }
    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptNumber(error) {
        var errorStr = "";
        if (error) {
            errorStr = "Ошибка! Не верный ввод. ";
        }
        return prompt(errorStr + "Введите целое число больше 1", "");
    }
    function factorization(num, multiplier) {
        var resultArray = [];
        if (multiplier === undefined) {
            multiplier = 2;
        }
        if (num === multiplier) {
            return [num];
        }
        if (num < multiplier) {
            return [];
        }
        while (num % multiplier === 0) {
            resultArray.push(multiplier);
            num /= multiplier;
        }
        return resultArray.concat(factorization(num, multiplier + 1));
    }
    var input, output;
    input = promptNumber();
    while (input !== null && !(isIntNumber(input) && input > 1)) {
        input = promptNumber(true);
    }
    if (input === null) {
        return;
    }
    input = parseInt(input.trim(), 10);
    output = factorization(input);
    alert("Введено число " + input + "\nПростые множители числа\n" + output);
}

function les4job6_2() {
    "use strict";
    function palindrome(word) {
        if (/^\s*$/.test(word)) {
            return false;
        }
        if (word[0] === word[word.length - 1]) {
            if (word.length <= 2) {
                return true;
            } else {
                return palindrome(word.slice(1, word.length - 1));
            }
        } else {
            return false;
        }
    }
    var input = prompt("Введите слово", "");
    if (input === null) {
        return;
    }
    
    alert("Слово " + input + (palindrome(input) ? " " : " не ") + "является палиндромом");
}