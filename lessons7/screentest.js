var numColor = 0;
var colors = ["#000", "#f00", "#0f0", "#00f", "#fff"];
var mouseDiv; //почему то onmousedown не работал в body;
var timerId = null;

var DELAY = 1000;

function changeColor(onlySet) {
    "use strict";
    if (onlySet !== true) {
        numColor += 1;
        if (numColor >= colors.length) {
            numColor = 0;
        }
        document.body.style.backgroundColor = colors[numColor];
    } else {
        document.body.style.backgroundColor = colors[numColor];
    }
}

function activateTimer() {
    "use strict";
    if (timerId !== null) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(function tik() {
        changeColor();
        timerId = setTimeout(tik, DELAY);
    }, DELAY);
}

function eventFun(e) {
    "use strict";
    changeColor();
    if (timerId !== null) {
        clearTimeout(timerId);
        activateTimer();
    } else {
        activateTimer();
    }
}

function goToFullscreen() {
    "use strict";
    var html = document.documentElement;
    if (html.requestFullscreen) {
        html.requestFullscreen();
    } else if (html.webkitRequestFullscreen) {
        html.webkitRequestFullscreen();
    } else if (html.mozRequestFullScreen) {
        html.mozRequestFullScreen();
    } else if (html.msRequestFullscreen) {
        html.msRequestFullscreen();
    }
}

function main() {
    "use strict";
    document.body.style.overflow = "hidden";
    mouseDiv = document.createElement("div");
    document.body.appendChild(mouseDiv);
    mouseDiv.style.position = "absolute";
    mouseDiv.style.width = "100%";
    mouseDiv.style.height = "100%";
    //mouseDiv.onkeydown = eventFun;
    //mouseDiv.onclick = eventFun;
    mouseDiv.ondblclick = goToFullscreen;

    document.body.onkeydown = eventFun;
    changeColor(true);

    activateTimer();
}
main();