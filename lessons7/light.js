function Phase(lamps, time, move, blick) {
    "use strict";
    if (move === undefined) {
        move = false;
    }
    if (blick === undefined) {
        blick = false;
    }
    if (!Array.isArray(lamps)) {
        lamps = [];
    }
    if (time === undefined) {
        time = 0;
    }
    this.getLamps = function () {
        return lamps;
    };
    this.timeFn = function (pTime) {
        if (pTime !== undefined) {
            time = pTime;
        }
        return time;
    };
    this.isMove = function () {
        return move;
    };
    this.isBlick = function () {
        return blick;
    };
}

var colors = {red: 0, yellow: 1, green: 2};

var SIZE = 40;
var BLICK_TIME = 250;


function Svetofor(beginPhase, started) {
    "use strict";
    var phases, makeSvetofor, element, lamps = [], blickTime, size, timerId, changePhase, phase, setColor, onOffLamp, i, setBlick, blickTimerId, blickOnOff;
    blickTime = BLICK_TIME;
    blickTimerId = null;
    timerId = null;
    
    phases = [
        new Phase([colors.red], 5000, false, false),
        new Phase([colors.red, colors.yellow], 1000),
        new Phase([colors.green], 3000, true),
        new Phase([colors.green], 2000, true, true),
        new Phase([colors.yellow], 2000, true)
    ];
    if (beginPhase === undefined) {
        phase = 0;
    } else {
        phase = beginPhase;
    }
    if (started === undefined) {
        started = false;
    }
    this.isMove = function () {
        return phases[phase].isMove();
    };
    this.getLeft = function () {
        return element.offsetLeft;
    };
    this.getWeight = function () {
        return element.offsetWidth;
    };
    this.start = function () {
        started = true;
        timerId = setTimeout(function tik() {
            changePhase();
            setColor();
            setBlick(phases[phase].isBlick());
//            setBlick(true);
            timerId = setTimeout(tik, phases[phase].timeFn());
        }, phases[phase].timeFn());
    };
    setColor = function () {
        var i, ls;
        ls = phases[phase].getLamps();
        for (i = 0; i < lamps.length; i += 1) {
            onOffLamp(i, false);
        }
        for (i = 0; i < ls.length; i += 1) {
            onOffLamp(ls[i], true);
        }
    };
    changePhase = function () {
        if (blickTimerId !== null) {
            setBlick(false);
        }
        phase += 1;
        if (phase >= phases.length) {
            phase = 0;
        }
    };
    onOffLamp = function (color, on) {
        lamps[color].style.visibility = on ? "visible" : "hidden";
    };
    setBlick = function (blick) {
        var i, l;
        if (blick === undefined) {
            blick = false;
        }
        if (blick) {
            if (blickTimerId !== null) {
                clearTimeout(blickTimerId);
            }
            blickOnOff = false;
            blickTimerId = setTimeout(function tik() {
                if (blickTimerId === null) {
                    return;
                }
                l = phases[phase].getLamps();
                for (i = 0; i < l.length; i += 1) {
                    onOffLamp(l[i], blickOnOff);
                }
                blickOnOff = !blickOnOff;
                blickTimerId = setTimeout(tik, blickTime);
            }, blickTime);
        } else {
            blickOnOff = false;
            if (blickTimerId !== null) {
                clearTimeout(blickTimerId);
                blickTimerId = null;
            }
        }
    };
    makeSvetofor = function () {
        var i, l, c;
        element = document.createElement("div");
        for (i = 0; i < 3; i += 1) {
            l = document.createElement("div");
            l.style.borderRadius = "50%";
            l.style.width = SIZE + "px";
            l.style.height = SIZE + "px";
            l.style.margin = Math.round(SIZE / 5) + "px";
            lamps[i] = l;
            element.appendChild(l);
        }
        for (c in colors) {
            lamps[colors[c]].style.backgroundColor = c;
        }
        element.style.backgroundColor = "gray";
        element.style.border = "2px solid black";
        element.style.display = "inline-block";
        document.body.appendChild(element);
        document.body.style.textAlign = "center";
        document.body.style.paddingTop = "20px";
        setColor();
        setBlick(phases[phase].isBlick());
    };
    makeSvetofor();
}

var carTimerId = null;
function startCar(sv) {
    "use strict";
    var car, x, left, b;

    function setX() {
        car.style.left = x + "px";
    }
    function nearSvetofor() {
        var w;
        w = car.clientWidth;
        return x + w + 10 >= sv.getLeft() && x - 10 <= sv.getLeft() + sv.getWeight();
        
    }
    b = document.body;
    car = document.createElement("div");
    car.style.position = "absolute";
    car.style.top = "300px";
    car.style.width = "100px";
    car.style.height = "30px";
    car.style.border = "1px solid black";
    left = false;
    x = 10;
    setX();
    
    b.appendChild(car);
    carTimerId = setTimeout(function tik() {
        if (!(nearSvetofor() && !sv.isMove())) {
            x = left ? x - 10 : x + 10;
        }
        if (x < 10) {
            x = 10;
            left = false;
        }
        if (x > b.clientWidth - car.clientWidth - 10) {
            x = b.clientWidth - car.clientWidth - 10;
            left = true;
        }
        setX();
        carTimerId = setTimeout(tik, 50);
    }, 50);
}

function main() {
    "use strict";
    var svetofor = new Svetofor();
    svetofor.start();
    startCar(svetofor);
}
main();