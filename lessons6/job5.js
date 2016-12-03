/*jslint devel: true */

function les6job5() {
    "use strict";
    
    
    var symbStr = "!@#$%&*()|,.?",
        regRight = new RegExp("^[a-zA-Z0-9" + symbStr + "]+$", ""),
        regLetter = /[a-z]/,
        regBigLetter = /[A-Z]/,
        regSymbol = new RegExp("[" + symbStr + "]", ""),
        regDigit = /\d/,
        input,
        difficulty;
    while (true) {
        input = prompt("Введите пароль. Пароль может состоять из букв, цифр и символов \"" + symbStr + "\"", "");
        if (input === null) {
            return;
        }
        if (regRight.test(input)) {
            break;
        } else {
            alert("Ошибка. Пароль содержит недопустимые символы");
        }
    }
    difficulty = 0;
    if (regLetter.test(input)) {
        difficulty += 26;
    }
    if (regBigLetter.test(input)) {
        difficulty += 26;
    }
    if (regDigit.test(input)) {
        difficulty += 10;
    }
    if (regSymbol.test(input)) {
        difficulty += symbStr.length;
    }
    difficulty = Math.pow(difficulty, input.length);
    //prompt("", difficulty);
    if (difficulty > 1001129150390625) {
        alert("Очень сложный пароль");
    } else if (difficulty > 53459728531456) {
        alert("Сложный пароль");
    } else if (difficulty > 8031810176) {
        alert("Пароль средней сложности");
    } else if (difficulty > 11881376) {
        alert("Легкий пароль");
    } else {
        alert("Очень легкий пароль");
    }

}