/*jslint devel: true */

function les3job5() {
    "use strict";
    var i, arr = [], min, minInd, max, maxInd;
    for (i = 0; i < 10; i += 1) {
        arr.push(Math.floor(Math.random() * (21)) - 10);
        //arr.push(i);
    }
    min = Infinity;
    max = -Infinity;
    for (i = 0; i < arr.length; i += 1) {
        if (arr[i] < min) {
            min = arr[i];
            minInd = i;
        }
        if (arr[i] > max) {
            max = arr[i];
            maxInd = i;
        }
    }
    alert("Массив: " + arr +
        "\nМинимальное число: " + min + "\nИндекс минимального числа: " + minInd +
         "\nМаксимальное число: " + max + "\nИндекс минимального числа: " + maxInd);
}