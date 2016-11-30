/*jslint devel: true */

var security = {
    name: "user",
    password: "qwerty",
    login: function (name, password) {
        "use strict";
        return this.name === name && this.password === password;
    }
};

function les4job2_1() {
    "use strict";
    var name, password, result;
    do {
        name = prompt("Введите имя пользователя", "");
        if (name === null) {
            return;
        }
        password = prompt("Введите пароль", "");
        if (password === null) {
            return;
        }
        result = security.login(name, password);
        if (result) {
            alert("Здравствуй " + name);
        } else {
            alert("Неверная пара логин-пароль");
        }
    } while (!result);
}