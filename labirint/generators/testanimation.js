/*global performance */
/*jslint devel: true */

var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;

var Direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

function spriteToBP(x, y) {
    "use strict";
    return x * -SPRITE_WIDTH + "px " + y * -SPRITE_HEIGHT + "px";
}

var player, outDiv;
outDiv = document.getElementById("out");
player = outDiv.children[0];
player.style.backgroundPosition = spriteToBP(0, 10);
/*var start = 0;
var x = 0;
var animId = null;
var frame = 0;
var frameNum = 0;

function keyEvent(e) {
    "use strict";
    //console.log(e);
    if (e.repeat) {
        return;
    }
    if (e.type === "keyup" && e.key === "ArrowRight" && animId !== null) {
        window.cancelAnimationFrame(animId);
        player.style.backgroundPosition = spriteToBP(0, 10);
        animId = null;
    }
    if (e.type === "keydown" && e.key === "ArrowRight") {
        if (animId === null) {
            start = performance.now();
            frame = 0;
            frameNum = 0;
            player.style.backgroundPosition = spriteToBP(1, 10);
            animId = window.requestAnimationFrame(function animRight(time) {
                var dtime = time - start;
                x += dtime / 20;
                frame += dtime;
                if (frame > 250) {
                    frame = 0;
                    if (frameNum === 0) {
                        frameNum = 1;
                        player.style.backgroundPosition = spriteToBP(2, 10);
                    } else {
                        frameNum = 0;
                        player.style.backgroundPosition = spriteToBP(1, 10);
                    }
                }
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
}*/
var start; //время после предидущего кадра
var moving; // true - анимация выполняется. false нет. Нужно т.к была задержка при остановке через cancelAnimationFrame
var animId = null;
var frameNum = 0; //какой из кадров отображается
var frameTime; //время прошедшее с переключения кадра
var dir = Direction.right; //направление движения
var x = 0;
player.style.backgroundPosition = spriteToBP(0, 10);
player.style.left = Math.round(x) + "px";
function keyEvent(e) {
    "use strict";
    function setWalkSprite() {
        switch (dir) {
        case Direction.left:
            player.style.backgroundPosition = spriteToBP(frameNum, 9);
            break;
        case Direction.right:
            player.style.backgroundPosition = spriteToBP(frameNum, 10);
            break;
        }
    }
    function startAnimation() {
        frameNum = 1;
        frameTime = 0;
        moving = true;
        setWalkSprite()
        start = performance.now();
        if (animId === null) {
            animId = window.requestAnimationFrame(function anim(time) {
                if (!moving) {
                    return;
                }
                var dtime = time - start;
                start = time;
                if (dir === Direction.left) {
                    x -= dtime / 15;
                } else if (dir === Direction.right) {
                    x += dtime / 15;
                }
                player.style.left = Math.round(x) + "px";
                frameTime += dtime;
                if (frameTime > 250) {
                    frameTime = 0;
                    frameNum = frameNum === 1 ? 2 : 1;
                    setWalkSprite();
                }
                animId = window.requestAnimationFrame(anim);
            });
        }
    }
    if (e.type === "keydown" && !e.repeat) {
        switch (e.key) {
            case "ArrowLeft":
                dir = Direction.left;
                if (!moving) {
                    startAnimation();
                }
                break;
            case "ArrowRight":
                dir = Direction.right;
                if (!moving) {
                    startAnimation();
                }                
                break;            
        }
    } else if (e.type === "keyup" && !e.repeat) {
        frameNum = 0;
        moving = false;
        setWalkSprite();
        if (animId !== null) {
            window.cancelAnimationFrame(animId);
            animId = null;
        }
    }
}
document.body.onkeydown = keyEvent;
document.body.onkeyup = keyEvent;

