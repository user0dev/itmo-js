var colors = {red: 0, yellow: 1, green: 2};
var phases = {
    red: 0, redYellow: 1, green: 2, green: }
var lamps = [];
var SIZE = 100;




function main() {
    "use strict";
    var div, i, l, c;
    div = document.createElement("div");
    for (i = 0; i < 3; i += 1) {
        l = document.createElement("div");
        l.style.borderRadius = "50%";
        l.style.width = SIZE + "px";
        l.style.height = SIZE + "px";
        l.style.margin = Math.round(SIZE / 5) + "px";
        lamps[i] = l;
        div.appendChild(l);
    }
    for (c in colors) {
        lamps[colors[c]].style.backgroundColor = c;
    }
    div.style.backgroundColor = "gray";
    div.style.border = "2px solid black";
    div.style.display = "inline-block";
    document.body.appendChild(div);
    document.body.style.textAlign = "center";
    document.body.style.paddingTop = "20px";
}
main();