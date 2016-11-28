/*jslint devel: true */

function les3job3() {
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
            errorStr = "Ошибка! Не верный ввод\n";
        }
        return prompt(errorStr + "Введите число до которого нужно найти простые числа\nЭто должно быть целое число больше 1", "");
    }
    function findNewNum(nums, p) {
        var i;
        for (i = p; i <= nums.length; i += 1) {
            if (nums[i - 1] !== null) {
                return nums[i - 1];
            }
        }
        return null;
    }
    var input, nums = [], maxNum, i, n, resultStr = "", countNum = 0;
    
    input = promptNumber();
    while (input !== null && !isIntNumber(input) && input <= 1) {
        input = promptNumber(true);
    }
    if (input === null) {
        return;
    }
    maxNum = +input;
    for (i = 2; i <= maxNum; i += 1) {
        nums.push(i);
    }
    n = 2;
    while (n !== null) {
        for (i = 2; i * n - 2 < nums.length; i += 1) {
            nums[i * n - 2] = null;
        }
        n = findNewNum(nums, n);
    }
    for (i = 0; i < nums.length; i += 1) {
        if (nums[i] !== null) {
            countNum += 1;
            resultStr += " " + nums[i];
        }
    }
    alert("Простые числа до " + maxNum + " найдено чисел: " + countNum + "\nЧисла:" + resultStr);
}