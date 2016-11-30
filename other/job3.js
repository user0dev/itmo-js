/*jslint devel: true */

function warriors() {
    "use strict";
    function random(max, min) {
        return Math.floor(Math.random() * (max - min) + 1) + min;
    }
    function strike(wAt, wPr) {
        var hit = wAt.at - wPr.pr;
        if (hit > 0) {
            wPr.hp -= hit;
            return hit;
        }
        return 0;
    }
    function getWar(war, n) {
        return "Боец " + n + "\nЗдоровье: " + war.hp + "\nАтака: " + war.at + "\nЗащита: " + war.pr;
    }
    var w1, w2, round, circle, win1, win2, draw, output, count;
    win1 = 0;
    win2 = 0;
    draw = 0;
    count = 100;
    for (circle = 0; circle < count; circle += 1) {
    
        w1 = { hp: random(15, 5), at: random(5, 1), pr: random(4, 0) };
        w2 = { hp: random(15, 5), at: random(5, 1), pr: random(4, 0) };
        round = 0;
        
        while (w1.hp > 0 && w2.hp > 0 && round < 30) {
            round += 1;
            if (count === 1) {
                alert("Раунд: " + round + "\n\n" + getWar(w1, 1) + "\n\n" + getWar(w2, 2));
            }
            strike(w1, w2);
            strike(w2, w1);
        }
        if (w1.hp <= 0 && w2.hp > 0) {
            win2 += 1;
            if (count === 1) {
                alert("Бой окончен!\nПобедил боец 2");
            }
        } else if (w2.hp <= 0 && w1.hp > 0) {
            win1 += 1;
            if (count === 1) {
                alert("Бой окончен!\nПобедил боец 1");
            }
        } else {
            draw += 1;
            if (count === 1) {
                alert("Ничья!");
            }
        }
    }
    if (count !== 1) {
        alert("Боев проведено: " + count + "\nПобед у команды 1: " + win1 + "\nПобед у команды 2: " + win2
             + "\nНичьих: " + draw);
    }
}