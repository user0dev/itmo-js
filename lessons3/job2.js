/*jslint devel: true */
/*jslint plusplus: true */

function les3job2_1() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }
    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptCountCities(error) {
        var errorStr = "";
        if (error === true) {
            errorStr = "Ошибка! Введите целое число больше нуля! ";
        }
        return prompt(errorStr + "Введите колличество городов", "");
    }
    
    var input, countCities, i, cities = [];
    
    input = promptCountCities();

    while (!(isIntNumber(input) && input > 0)) {
        if (input === null) {
            return;
        }
        input = promptCountCities(true);
    }
    countCities = +input;
    for (i = 0; i < countCities; i++) {
        input = prompt("Введите название города. Осталось: " + (countCities - i), "");
        if (input === null) {
            return;
        }
        if (input.trim() !== "") {
            cities.push(input.trim());
        } else {
            i--;
        }
    }
    alert(cities);
}

function les3job2_2() {
    "use strict";
    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }
    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function promptCity(error) {
        var errorStr = "";
        if (error === true) {
            errorStr = "Ошибка при вводе города! ";
        }
        return prompt(errorStr + "Введите название города или пустую строку для окончания ввода", "");
    }
    var input, i, cities = [];
    
    input = promptCity();
    while (input.trim() !== "") {
        if (input === null) {
            return;
        }
        cities.push(input);
        input = promptCity();
    }
    if (cities.length !== 0) {
        alert(cities.join(" "));
    } else {
        alert("Городов не введено");
    }
}