/*jslint devel: true */

function Warrior(myname, weapon, maxbullets) {
    "use strict";
    var bullets = 0; // Текущее число патронов
    this.getbullets = function (amount) {//это setter =)
        if (amount !== undefined) {
            if (amount <= 0) {
                alert('Дай больше 0!');
                return;
            }
            if (amount + bullets > maxbullets) {
                console.log('Взял ' + (maxbullets - bullets) + ' патронов из ' + amount);
                bullets = maxbullets;
            } else {
                bullets += amount;
                console.log('Взял ' + bullets + ' патронов');
            }
        } else {
            console.log('У меня ' + bullets + ' патронов из ' + maxbullets);
        }
    };
}

function les5job1() {
    "use strict";
    var valera = new Warrior('Валера', 'Автомат', 300);
    valera.getbullets();
    valera.getbullets(50);
    valera.getbullets(270);
    valera.getbullets();
}