/*jslint devel: true */

function les6job2() {
    "use strict";
    var input, s;
    while (true) {
        input = prompt("Введите номер телефона в произвольном формате", " +7 988-777 * 9994 \t");
        if (input === null) {
            return;
        }
        s = input.replace(/[\s+*\-]/g, "");
        if (!/^[78]?\d{10}$/.test(s)) {
            alert("Не верный ввод");
        } else {
            alert("+7 (" + s.slice(-10, -7) + ") " + s.slice(-7, -4) + "-" + s.slice(-4, -2) + "-" + s.slice(-2));
        }
    }
}