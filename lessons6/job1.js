/*jslint devel: true */

function les6job1() {
    "use strict";
    var input = prompt("Введите адрес электронной почты", ""), right;
    if (input === null) {
        return;
    }
    right = /^\w+\@[a-z0-9_.]+\.[a-z]{2,}$/i.test(input);
    right = right && !(/\w+\@[a-z0-9_.]*mailforspam[a-z0-9_.]*\.[a-z]{2,}/i.test(input));
    alert("Вы ввели" + (right ? " " : " не ") + "верный email");
}