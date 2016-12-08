/*global performance */
/*jslint devel: true */

var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;

function spriteToBP(x, y) {
    "use strict";
    return x * -SPRITE_WIDTH + "px " + y * -SPRITE_HEIGHT + "px";
}

var player, outDiv;
outDiv = document.getElementById("out");
player = outDiv.children[0];
player.style.backgroundPosition = spriteToBP(0, 10);
var start = 0;
var x = 0;
var animId = null;
var frame = 0;

function keyEvent(e) {
    "use strict";
    //console.log(e);
    if (e.repeat) {
        return;
    }
    if (e.type === "keyup" && e.key === "ArrowRight" && animId !== null) {
        window.cancelAnimationFrame(animId);
        animId = null;
    }
    if (e.type === "keydown" && e.key === "ArrowRight") {
        if (animId === null) {
            start = performance.now();
            frame = 0;
            animId = window.requestAnimationFrame(function animRight(time) {
                var dtime = time - start;
                x += dtime * 0.1;
                frame += dtime;
                start = time;
                player.style.left = Math.round(x) + "px";
                animId = window.requestAnimationFrame(animRight);
            });
        }
    }
    if (e.type === "keyup" && e.key === "ArrowLeft" && animId !== null) {
        window.cancelAnimationFrame(animId);
        animId = null;
    }
    if (e.type === "keydown" && e.key === "ArrowLeft") {
        if (animId === null) {
            start = performance.now();
            animId = window.requestAnimationFrame(function animRight(time) {
                x -= (time - start) * 0.1;
                start = time;
                player.style.left = Math.round(x) + "px";
                animId = window.requestAnimationFrame(animRight);
            });
        }
    }
}
document.body.onkeydown = keyEvent;
document.body.onkeyup = keyEvent;

