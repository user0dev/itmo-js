/*jslint devel: true */

function les6job3() {
    "use strict";
    var input, result;
    while (true) {
        input = prompt("Введите ФИО", " Иванов\t Иван \t");
        if (input === null) {
            return;
        }
        result = input.match(/^\s*([a-zа-я]+)\s+([a-zа-я]+)\s+([a-zа-я]+)?\s*$/i);
        //alert(result);
        if (result.length === 3 || result[3] === undefined) {
            alert("Фамилия: " + result[1] + "\nИмя: " + result[2]);
        } else if (result.length === 4) {
            alert("Фамилия: " + result[1] + "\nИмя: " + result[2] + "\nОтчество: " + result[3]);
        } else {
            alert("Не верный ввод");
        }
    }
}