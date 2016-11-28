/*jslint devel: true */

function les3job1() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }

    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptCount(error) {
        var errorStr = "";
        if (error === true) {
            errorStr = "Ошибка. Не верный ввод ";
        }
        return prompt(errorStr + "Введите колличество потронов", "");
    }
    function getCartrigeStr(arr) {
        var i, str = "";
        for (i = 0; i < arr.length; i += 1) {
            str += arr[i] + "\n";
        }
        return str;
    }
    var input, i, arr = [], count, cartrige;
    input = promptCount();
    while (input !== null && !(isIntNumber(input) && input > 1)) {
        input = promptCount(true);
    }
    if (input === null) {
        return;
    }
    count = +input;
    cartrige = "патрон";
    alert("Выстрел - ввод любой строки и ок. Перезарядка - п. Отмена - завершение скрипта");
    for (i = 0; i < count; i += 1) {
        arr.push(cartrige);
    }
    do {
        input = prompt("Максимум патронов: " + count + "\nОсталось патронов: " + arr.length +
                      "\n\n" + getCartrigeStr(arr), "");
        if (input === null) {
            return;
        }
        if (input === "перезарядка" || input === "п") {
            while (arr.length < count) {
                arr.push(cartrige);
            }
        } else {
            if (arr.length > 0) {
                arr.shift();
            } else {
                alert("Закончились патроны");
            }
        }
    } while (input !== null);
}

function les3job1_2() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }

    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptCount(error) {
        var errorStr = "";
        if (error === true) {
            errorStr = "Ошибка. Не верный ввод ";
        }
        return prompt(errorStr + "Введите колличество потронов", "");
    }
    function getCartrigeStr(arr) {
        var i, str = "";
        for (i = 0; i < arr.length; i += 1) {
            str += arr[i] + "\n";
        }
        return str;
    }
    var input, i, arr = [], count, cartrige, shotCount, shotStr;
    input = promptCount();
    while (input !== null && !(isIntNumber(input) && input > 1)) {
        input = promptCount(true);
    }
    if (input === null) {
        return;
    }
    count = +input;
    cartrige = "патрон";
    alert("Выстрел - ввод любой строки и ок. Перезарядка - п. Отмена - завершение скрипта");
    for (i = 0; i < count; i += 1) {
        arr.push(cartrige);
    }
    shotCount = 0;
    do {
        if (shotCount > 0) {
            shotStr = "Сделано выстрелов: " + shotCount + "\n\n";
        } else {
            shotStr = "";
        }
        input = prompt(shotStr + "Максимум патронов: " + count + "\nОсталось патронов: " + arr.length +
                      "\n\n" + getCartrigeStr(arr), "");
        if (input === null) {
            return;
        }
        shotCount = 0;
        if (input === "перезарядка" || input === "п") {
            while (arr.length < count) {
                arr.push(cartrige);
            }
        } else {
            if (arr.length > 0) {
                for (i = 0; i < 3 && arr.length > 0; i += 1) {
                    shotCount += 1;
                    arr.shift();
                }
                
            } else {
                alert("Закончились патроны");
            }
        }
    } while (input !== null);
}