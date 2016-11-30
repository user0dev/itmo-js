/*jslint devel: true */

function draznilka() {
    "use strict";
    function randomInt(max) {
        max = +max;
        return Math.floor(Math.random() * (max));
    }
    var arr1 = ["Ты", "Вы", "Она"],
        arr2 = [" грязная", " мокрая", " вонючая", " глупая"],
        arr3 = [" курица", " утка", " жаба"];
    alert(arr1[randomInt(arr1.length)] + arr2[randomInt(arr2.length)] + arr3[randomInt(arr3.length)]);
}