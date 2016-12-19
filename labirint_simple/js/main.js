/*global randomInt, isNumber, isIntNumber, randomBool, textMap, FloorObject, map, PLAYER_X, PLAYER_Y, gameOver, player */
/*jslint devel: true */
/*jslint nomen: true */
/*jslint vars: true */
/*global performance */

var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;
var SW = SPRITE_WIDTH;
var SH = SPRITE_HEIGHT;


//var floorType = { wall: 0, floor: 1, floorWithDoor: 2, floorWithJug: 3, exit: 4, fakeWall: 5};

var floorType = {
    wall: "*",
    floor: " ",
    floorWithDoor: "d",
    floorWithJug: "j",
    exit: "e",
    fakeWall: "f",
    torch: "t",
    lava: "l",
    thorns: "t",
    plain: "p",
    superPower: "P",
    healthPotion: "h",
    skeleton: "k",
    bat: "b",
    ghost: "g",
    slug: "s",
    bigTorch: "T",
    candle: "c",
    spider: "S",
    isValidType: function (charType) {
        "use strict";
        var key;
        for (key in floorType) {
            if (typeof floorType[key] === "string" && floorType[key] === charType) {
                return true;
            }
        }
        return false;
    }
};



var Direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};
function dirToX(dir) {
    "use strict";
    if (dir === Direction.left) {
        return -1;
    } else if (dir === Direction.right) {
        return 1;
    }
    return 0;
}
function dirToY(dir) {
    "use strict";
    if (dir === Direction.up) {
        return -1;
    } else if (dir === Direction.down) {
        return 1;
    }
    return 0;
}

function spriteToBP(x, y) {
    "use strict";
    return x * -SPRITE_WIDTH + "px " + y * -SPRITE_HEIGHT + "px";
}


function FloorObject(x, y, type) {
    "use strict";
    var elements = [], makeInner, startAnimation, start = 0, self;
    var animId = null;
    elements[0] = map.getTableCell(x, y);
    this.getType = function () {
        return type;
    };
    this.durability = 5;
    this.actived = false;
    this.opened = false;
    self = this;
    makeInner = function (bp) {
        var div;
        if (elements[0] !== undefined && elements[1] === undefined) {
            div = document.createElement("div");
            div.classList.add("sprite");
            if (bp !== undefined) {
                div.style.backgroundPosition = bp;
            }
            elements[1] = div;
            elements[0].appendChild(div);
        } else if (elements[1] !== undefined && bp !== undefined) {
            elements[1].style.backgroundPosition = bp;
        }
    };
    this.init = function () {
        this.durability = 5;
        this.actived = false;
        this.opened = false;
        switch (this.getType()) {
        case floorType.wall:
            elements[0].style.backgroundPosition = spriteToBP(9, 0);
            break;
        case floorType.exit:
            elements[0].style.backgroundPosition = spriteToBP(10, 5);
            break;
        case floorType.floorWithDoor:
            elements[0].style.backgroundPosition = spriteToBP(8, 6);
            makeInner(spriteToBP(4, 1));
            break;
        case floorType.floorWithJug:
            elements[0].style.backgroundPosition = spriteToBP(8, 6);
            makeInner(spriteToBP(4, 3));
            break;
        case floorType.fakeWall:
            elements[0].style.backgroundPosition = spriteToBP(9, 0);
            break;
        case floorType.lava:
            elements[0].style.backgroundPosition = spriteToBP(7, 5);
            //startAnimation();
            break;
        case floorType.superPower:
            elements[0].style.backgroundPosition = spriteToBP(8, 6);
            makeInner(spriteToBP(14, 13));
            //startAnimation();
            break;
        default: // по умолчанию пол
            elements[0].style.backgroundPosition = spriteToBP(8, 6);
        }
    };
    this.init();
    this.isStand = function () { //на эту клетку можно встать
        if (this.durability <= 0) {
            return true;
        }
        switch (this.getType()) {
        case floorType.floor:
            return true;
        case floorType.exit:
            return true;
        case floorType.floorWithDoor:
            if (this.actived) {
                return false;
            } else {
                return this.opened;
            }
        case floorType.floorWithJug:
            return this.opened;
        case floorType.fakeWall:
            return true;
        case floorType.lava:
            return true;
        case floorType.superPower:
            return true;
        }
        return false;
    };
    this.canCatchUp = function () {
        if (this.durability <= 0) {
            return false;
        }
        switch (type) {
        case floorType.superPower:
            return true;
        default:
            return false;
        }
    };
    this.catchUp = function () {
        if (this.canCatchUp()) {
            if (type === floorType.superPower) {
                this.durability = 0;
                player.superPower += 5;
                player.updateSuperPower();
                if (elements[1] !== undefined) {
                    //elements[1].style.backgroundPosition = spriteToBP(0, 0);
                    //elements[1].style.background = "transparent";
                    elements[1].style.visibility = "hidden";

                }
            }
        }
    };
    this.canAttack = function () {
        if (this.durability <= 0) {
            return false;
        }
        switch (type) {
        case floorType.wall:
        case floorType.floorWithDoor:
        case floorType.floorWithJug:
            return true;
        default:
            return false;
        }
    };
    this.attacked = function () {
        if (!this.canAttack()) {
            return false;
        }
        switch (type) {
        case floorType.wall:
            if (player.superPower > 0) {
                this.durability -= 1;
                player.superPower -= 1;
                player.updateSuperPower();
                if (this.durability <= 0) {
                    elements[0].style.backgroundPosition = spriteToBP(6, 7);
                    makeInner();
                    elements[1].style.backgroundPosition = spriteToBP(6, 4);
                }
            }
            break;
        case floorType.floorWithDoor:
            if (player.superPower > 0) {
                player.superPower -= 1;
                player.updateSuperPower();
                this.durability -= 2.5;
                if (this.durability <= 0) {
                    elements[1].style.backgroundPosition = spriteToBP(7, 4);
                }
            }
            break;
        case floorType.floorWithJug:
            this.action();
            break;
        }
    };
    this.damage = function () {
        switch (this.getType()) {
        case floorType.lava:
            return 4;
        default:
            return 0;
        }
    };
    this.isAction = function () { //с этой клеткой можно произвести действие
        if (this.getType() === floorType.floorWithDoor || this.getType() === floorType.floorWithJug) {
            return !this.actived;
        } else {
            return false;
        }
        
    };
    function stopAnimation() {
        if (animId !== null) {
            window.cancelAnimationFrame(animId);
            animId = null;
        }
    }
    startAnimation = function () {
        var spY = 0,
            spX,
            nextFrame = 1,
            oType = type;
//        if (type === floorType.floorWithDoor) {
//            spY = 1;
//        } else if (type === floorType.floorWithJug) {
//            spY = 3;
//        }
        if (animId !== null) {
            return;
        }
        switch (type) {
        case floorType.floorWithDoor:
            spY = 1;
            if (self.opened) {
                spX = 6;
                nextFrame = -1;
            } else {
                spX = 5;
            }
            break;
        case floorType.floorWithJug:
            spY = 3;
            spX = 5;
            break;
        case floorType.lava:
            spY = 5;
            spX = 7;
            break;
        case floorType.superPower:
            spY = 13;
            spX = 13;
            break;
        }
//        spX = 5;
//        if (type === floorType.floorWithDoor && self.opened) {
//            spX = 6;
//            nextFrame = -1;
//        }
        if (elements[1] !== undefined) {
            elements[1].style.backgroundPosition = spriteToBP(spX, spY);
        }
        start = performance.now();
        animId = window.requestAnimationFrame(function anim(time) {
            var dtime, animTimeout = 100;
/*            if (self.actived) {
                return;
            }*/
            if (animId === null) {
                return;
            }
            switch (oType) {
            case floorType.floorWithDoor:
            case floorType.floorWithJug:
                animTimeout = 100;
                break;
            case floorType.lava:
                animTimeout = 500;
                break;
            case floorType.superPower:
                animTimeout = 300;
                break;
            default:
                animTimeout = 100;
            }
            dtime = time - start;
            if (dtime > animTimeout) {
                start = time;
                spX += nextFrame;
                switch (oType) {
                case floorType.floorWithJug:
                case floorType.floorWithDoor:
                    if (spX < 7 && spX > 4) {
                        
                        elements[1].style.backgroundPosition = spriteToBP(spX, spY);
                    } else {
                        self.opened = nextFrame === 1; //позволяет определить открыта или закрыта дверь
                        // если анимация шла вперед то открыта если назад то закрыта
//                        if (oType === floorType.floorWithJug) {
//                            player.superPower += 5;
//                            player.updateSuperPower();
//                        }
                        elements[1].style.backgroundPosition = spriteToBP(spX, spY);
                        window.cancelAnimationFrame(animId);
                        animId = null;
                        if (oType === floorType.floorWithDoor) {
                            self.actived = false;
                        }
                        return;
                    }
                    break;
                case floorType.lava:
                    if (spX > 8) {
                        spX = 7;
                    }
                    if (elements[0] !== undefined) {
                        elements[0].style.backgroundPosition = spriteToBP(spX, spY);
                    }
                    break;
                case floorType.superPower:
                    if (spX > 15) {
                        spX = 13;
                    }
                    if (elements[1] !== undefined) {
                        elements[1].style.backgroundPosition = spriteToBP(spX, spY);
                    }
                    break;
                } // switch (oType)
            }
            animId = window.requestAnimationFrame(anim);
        });
    };
    this.action = function () {
        if (this.isAction) {
//            if (elements[1] !== undefined) {
//                if (this.getType() === floorType.floorWithDoor) {
//                    elements[1].style.backgroundPosition = spriteToBP(7, 1);
//                    actived = true;
//                } else if (this.getType() === floorType.floorWithJug) {
//                    elements[1].style.backgroundPosition = spriteToBP(7, 3);
//                    actived = true;
//                }
//            }
            if (!this.actived) {
                this.actived = true;
                startAnimation();
            }
        }
    };
    this.computeSprite = function () {
        function isWall(type) {
            return type === floorType.wall || type === floorType.fakeWall;
        }
        if (isWall(this.getType())) {
            if (y + 1 >= map.height || !isWall(map.floorObjects[y + 1][x].getType())) {
                if (y - 1 < 0 || !isWall(map.floorObjects[y - 1][x].getType())) {
                    elements[0].style.backgroundPosition = spriteToBP(8, 0);
                } else {
                    elements[0].style.backgroundPosition = spriteToBP(10, 0);
                }
            } else if (y - 1 < 0 || !isWall(map.floorObjects[y - 1][x].getType())) {
                elements[0].style.backgroundPosition = spriteToBP(11, 0);
            }
        } else if (type === floorType.lava || type === floorType.superPower) {
            startAnimation();
        }
        
    };
    this.restory = function () {
//        if (elements[1] !== undefined) {
//            if (this.getType() === floorType.floorWithDoor) {
//                elements[1].style.backgroundPosition = spriteToBP(4, 1);
//                this.actived = false;
//            } else if (this.getType() === floorType.floorWithJug) {
//                elements[1].style.backgroundPosition = spriteToBP(4, 3);
//                this.actived = false;
//            }
//        }
        stopAnimation();
        this.init();
        this.computeSprite();
        if (elements[1] !== undefined) {
            elements[1].style.visibility = "visible";
        }
        if (type === floorType.wall) {
            if (elements[1] !== undefined && elements[0] !== undefined) {
                elements[0].removeChild(elements[1]);
                elements[1] = undefined;
            }
        }
//        switch (type) {
//                case this.getType()
//        }
    };
        
}
	
var player = {
    x: 0,
    y: 0,
    dx: 0, //смещение в пикселях
    dy: 0,
    maxHealth: 100,
    health: 100,
    healthLabel: null,
    element: null,
    direction: Direction.up,
    arrayForSprite: [],
    superPower: 0,
    superPowerLabel: null,
    updateSuperPower: function () {
        "use strict";
        if (this.superPowerLabel !== null) {
            this.superPowerLabel.textContent = "SuperPower: " + this.superPower;
        }
    },
    setSprite: function (xOrBP, y) { // принимает или координаты или строку
        "use strict";
        if (this.element) {
            if (typeof xOrBP === "string" && y === undefined) {
                this.element.style.backgroundPosition = xOrBP;
            } else if (typeof xOrBP === "number" && typeof y === "number") {
                this.element.style.backgroundPosition = spriteToBP(xOrBP, y);
            }
        }
    },
    updateHealth: function () {
        "use strict";
        if (this.headLabel !== null) {
            this.healthLabel.textContent = "Health: " + this.health + " %";
        }
    },
    isDead: function () {
        "use strict";
        return this.health <= 0;
    },
    dead: function () {
        "use strict";
        /*todo закончить функцию смерти*/
        this.setSprite(10, 10);
        player.cancelAnimation();
        setTimeout(function () { gameOver(true); }, 100);
    },
    damage: function (value) {
        "use strict";
        if (this.isDead()) {
            return;
        }
        if (value !== undefined && value > 0) {
            this.health -= value;
            if (this.health < 0) {
                this.health = 0;
                this.dead();
            }
            this.updateHealth();
        }
    },
    damageTimerId: null,
    stopDamageTimer: function () {
        "use strict";
        if (this.damage !== null) {
            clearTimeout(this.damageTimerId);
            this.damageTimerId = null;
        }
    },
    findDamage: function () { /*todo доделать функцию определяющую может ли персонаж получить урон*/
        "use strict";
        var x1, x2 = 0, y1, y2 = 0;
        if (player.health <= 0) {
            return 0;
        }
        x1 = player.x;
        y1 = player.y;
        if (player.dx < 0) {
            x2 = -1;
        } else if (player.dx > 0) {
            x2 = 1;
        }
        if (player.dy < 0) {
            y2 = -1;
        } else if (player.dy > 0) {
            y2 = 1;
        }
        if (x2 !== 0 || y2 !== 0) {
            x2 += x1;
            y2 += y1;
            return Math.max(map.floorObjects[y2][x2].damage(), map.floorObjects[y1][x1].damage());
        } else {
            return map.floorObjects[y1][x1].damage();
        }
    },
    startDamageTimer: function () { /*todo complate damage timer */
        "use strict";
        var d;
        if (player.damageTimerId === null && !player.isDead()) {
            player.damageTimerId = setTimeout(function tik() {
                var d;
                if (player.damageTimerId === null) {
                    return;
                }
                if (player.health <= 0) {
                    return;
                }
                d = player.findDamage();
                if (d > 0) {
                    player.damage(d);
                    if (player.health > 0) {
                        player.damageTimerId = setTimeout(tik, 500);
                    } else {
                        player.stopDamageTimer();
                    }
                } else {
                    player.stopDamageTimer();
                }
            }, 500);
        }
    },
    canIMove: function (dir) {
        "use strict";
        if (dir === undefined) {
            dir = this.direction;
        }
        var newX, newY;
        newX = this.x + dirToX(dir);
        newY = this.y + dirToY(dir);
        if (!map.coordCorrect(newX, newY)) {
            return false;
        }
        return map.floorObjects[newY][newX].isStand();
    },
    animId: null,
    newDirection: null,
    stopAndWalk: false,
    newStop: false,
    cancelAnimation: function () {
        "use strict";
        if (player.animId === null) {
            return;
        }
        window.cancelAnimationFrame(player.animId);
        player.animId = null;
        player.changeSprite();
    },
    stop: function () {
        "use strict";
        if (this.animId !== null) {
            this.newStop = true;
        } else {
            this.newStop = false;
        }
    },
    animationComplate: function () {
        "use strict";
        if (this.animId !== null) {
            window.cancelAnimationFrame(player.animId);
            this.animId = null;
        }
        this.changeSprite();
    },
    frame: 1,
    move: function (newDir) {
        "use strict";
        var start;
        var dir;
        if (player.health <= 0) {
            return;
        }
        if (newDir === undefined) {
            dir = this.direction;
        } else {
            dir = newDir;
        }
        if (dir === this.direction && this.animId !== null) {
            return;
        }
        /*todo доделать остановку */
    //if (true) { //if (this.canIMove(dir)) {
        if (this.animId === null) {
            this.newDirection = null;
            player.dx = 0;
            player.dy = 0;
            this.direction = dir;
            this.stopAndWalk = !this.canIMove();
            player.element.style.backgroundPosition = player.arrayForSprite[this.direction][player.frame];
            player.newStop = false;
            start = performance.now();
            var oldTime = start;
            player.animId = window.requestAnimationFrame(function anim(time) {
                function stopPlayer() { // после необходимо вызвать return;
                    player.newStop = false;
                    window.cancelAnimationFrame(player.animId);
                    player.animId = null;
                    player.newDirection = null;
                    player.changeSprite();
                }
                var dTime = time - oldTime;
                var dir = player.direction;
                var d = 0;
                oldTime = time;
                var ps = player.element.style;
                if (player.animId === null) {
                    return;
                }
                if (player.health <= 0) {
                    return;
                }
                if (player.stopAndWalk) {
                    if (player.newStop) {
                        stopPlayer();
                        return;
                    }
                    player.stopAndWalk = !player.canIMove();
                }
                if (time - start > 250) {
                    start = time;
                    player.frame = player.frame === 1 ? 2 : 1;
                    ps.backgroundPosition = player.arrayForSprite[dir][player.frame];
                }
                if (!player.stopAndWalk) {
                    player.dx += dirToX(dir) * dTime * 0.1;
                    player.dy += dirToY(dir) * dTime * 0.1;
                }
                if (Math.abs(player.dx) >= SW || Math.abs(player.dy) >= SH) { // сделан полный переход на клетку
                    //player.x += Math.floor(Math.abs(dx) / SW) * dirToX(dir);
                    //player.y += Math.floor(Math.abs(dy) / SH) * dirToY(dir);
                    player.x += dirToX(dir);
                    player.y += dirToY(dir);
                    if (map.floorObjects[player.y][player.x].getType() === floorType.exit) {
                        gameOver();
                        return;
                    }
                    map.posCamera();
                    if (map.floorObjects[player.y][player.x].canCatchUp) {
                        map.floorObjects[player.y][player.x].catchUp();
                    }
                    //map.posCamera();
                    if (player.newStop) {
                        stopPlayer();
                        return;
                    }
                    player.stopAndWalk = !player.canIMove();
                    /*if (dx > 0) {
                        dx -= SW;
                    } else if (dx < 0) {
                        dx += SW;
                    }
                    if (dy > 0) {
                        //dy -= SH;
                    } else if (dy < 0) {
                        dy += SH;
                    }*/
                    player.dx = 0;
                    player.dy = 0;
                    d = player.findDamage();
                    if (d > 0 && player.damageTimerId === null) {
                        player.damage(d);
                        player.startDamageTimer();
                    }
                    if (player.newDirection !== null) {
                        dir = player.newDirection;
                        player.direction = dir;
                        player.stopAndWalk = !player.canIMove();
                        ps.backgroundPosition = player.arrayForSprite[dir][player.frame];
                        ps.left = player.x * SW + "px";
                        ps.top = player.y * SH + "px";
                        player.newDirection = null;
                    } else {
                        if (!player.stopAndWalk) {
                            ps.left = Math.round(player.x * SW + player.dx) + "px";
                            ps.top = Math.round(player.y * SH + player.dy) + "px";
                        }
                    }
                    //player.animationComplate();
                    //return;
                } else {
                    if (!player.stopAndWalk) {
                        ps.left = Math.round(player.x * SW + player.dx) + "px";
                        ps.top = Math.round(player.y * SH + player.dy) + "px";
                        map.posCamera(player.dx, player.dy);
                    }
                    d = player.findDamage();
                    if (d > 0) {
                        if (player.damageTimerId === null) {
                            player.damage(d);
                            player.startDamageTimer();
                        }
                    }
                    
                }


                player.animId = window.requestAnimationFrame(anim);
            });
        } else { //анимация запущена
            if (this.stopAndWalk) {
                player.direction = dir;
                player.element.style.backgroundPosition = player.arrayForSprite[dir][player.frame];
                this.stopAndWalk = !this.canIMove();
            } else {
                var pd = player.direction;
                var D = Direction;
                if ((pd === D.up && dir === D.down) ||
                        (pd === D.down && dir === D.up) ||
                        (pd === D.left && dir === D.right) ||
                        (pd === D.right && dir === D.left)) {
                    player.direction = dir;
                    player.element.style.backgroundPosition = player.arrayForSprite[dir][player.frame];
                    this.stopAndWalk = !this.canIMove();
                } else {
                    this.newDirection = dir;
                }
                
            }
        }
        /*this.changeSprite();
        map.posCamera();
        }
        return true;*/
    //}
        //this.changeSprite();
        //return false;
    },
    setDirection: function (direction) {
        "use strict";
        this.direction = direction;
        this.changeSprite();
    },
    initPlayer: function () {
        "use strict";
        function setSprites(arr, yCoord, xOffset) {
            var i;
            if (xOffset === undefined) {
                xOffset = 0;
            }
            for (i = xOffset; i < (xOffset + 3); i += 1) {
                arr[i] = spriteToBP(i, yCoord);
            }
        }
        this.dx = 0;
        this.dy = 0;
        player.health = player.maxHealth;
        player.superPower = 0;
        this.arrayForSprite[Direction.up] = [];
        setSprites(this.arrayForSprite[Direction.up], 11);
        this.arrayForSprite[Direction.down] = [];
        setSprites(this.arrayForSprite[Direction.down], 8);
        this.arrayForSprite[Direction.left] = [];
        setSprites(this.arrayForSprite[Direction.left], 9);
        this.arrayForSprite[Direction.right] = [];
        setSprites(this.arrayForSprite[Direction.right], 10);
        var div, h;
        if (this.element === null) {
            div = document.createElement("div");
            this.element = div;
            div.id = "player";
            map.table.appendChild(div);
            div.style.backgroundPosition = this.arrayForSprite[this.direction][0];
            div.style.left = map.xToLeft(this.x);
            div.style.top = map.yToTop(this.y);
            
        }
        if (this.healthLabel === null) {
            h = document.createElement("span");
            h.style.position = "absolute";
            h.style.right = "30px";
            h.style.top = "30px";
            h.style.color = "red";
            h.style.fontSize = "30px";
            this.healthLabel = h;
            document.body.appendChild(h);
        }
        this.updateHealth();
        if (this.superPowerLabel === null) {
            h = document.createElement("span");
            h.style.position = "absolute";
            h.style.right = "30px";
            h.style.top = "70px";
            h.style.color = "blue";
            h.style.fontSize = "30px";
            this.superPowerLabel = h;
            document.body.appendChild(h);
        }
        this.updateSuperPower();

        player.setPosition(PLAYER_X, PLAYER_Y);
        player.setDirection(Direction.up);
        
    }, //initPlayer()
    changeSprite: function () {
        "use strict";
        this.element.style.left = map.xToLeft(this.x);
        this.element.style.top = map.yToTop(this.y);
        if (player.health <= 0) {
            this.setSprite(10, 10);
        } else {
            this.setSprite(this.arrayForSprite[this.direction][0]);
        }
    },
    setPosition: function (x, y) {
        "use strict";
        this.x = x;
        this.y = y;
        this.changeSprite();
    },
    action: function () {
        "use strict";
        var ax, ay;
        if (player.health <= 0) {
            return;
        }
        ax = Math.round(this.x + dirToX(this.direction));
        ay = Math.round(this.y + dirToY(this.direction));
        if (map.coordCorrect(ax, ay) && map.floorObjects[ay][ax].isAction()) {
            map.floorObjects[ay][ax].action();
        }
    },
    attack: function () {
        "use strict";
        var x, y;
        if (player.health <= 0) {
            return;
        }
        x = dirToX(this.direction) + this.x;
        y = dirToY(this.direction) + this.y;
        if (map.coordCorrect(x, y) && map.floorObjects[y][x].canAttack()) {
            map.floorObjects[y][x].attacked();
        }
        
    }
};


function makeGameTable(width, height) {
    "use strict";
    var placeStr = "", i, j;
    placeStr = "<table id=\"gameTable\">";
    for (i = 0; i < height; i += 1) {
        placeStr += "<tr>";
        for (j = 0; j < width; j += 1) {
            placeStr += "<td></td>";
        }
        placeStr += "</tr>\n";
    }
    placeStr += "</table>";
    return placeStr;
}

var map = {
    table: null,
    gamePlase: null,
    getTableCell: function (x, y) {
        "use strict";
        return this.table.rows[y].cells[x];
    },
    width: 0,
    height: 0,
    floorObjects: [],
    coordCorrect: function (x, y) {
        "use strict";
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    },
    xToLeft: function (x) {
        "use strict";
        return x * 32 + "px";
    },
    yToTop: function (y) {
        "use strict";
        return y * 32 + "px";
    },
    lastCode: null,
 //   keys: [], //массив нажатых клавишь
    oKey: function (e) {
        "use strict";
/*        function keyCodeToDirection(keyCode) {
            switch (keyCode) {
            case 39:
            case 68:
                return Direction.right;
            case 38:
            case 87:
                return Direction.up;
            case 37:
            case 65:
                return Direction.left;
            case 40:
            case 83:
                return Direction.down;
            default:
                return null;
            }
        }*/
        if (e.type === "keydown" && !e.repeat) {
            //console.log(e.keyCode);
            switch (e.keyCode) {
            case 39:
            case 68:
                this.lastCode = e.keyCode;
                player.move(Direction.right);
                break;
            case 38:
            case 87:
                this.lastCode = e.keyCode;
                player.move(Direction.up);
                break;
            case 37:
            case 65:
                this.lastCode = e.keyCode;
                player.move(Direction.left);
                break;
            case 40:
            case 83:
                this.lastCode = e.keyCode;
                player.move(Direction.down);
                break;
            case 17:
            case 69:
                player.action();
                break;
            case 16:
            case 81:
                player.attack();
                break;
            }
            
        } else if (e.type === "keyup" && !e.repeat) {
            if (e.keyCode === this.lastCode) {
                this.lastCode = null;
                player.stop();
            }
        }
    },
    posCamera: function (dx, dy) {
        "use strict";
        if (dx === undefined || dy === undefined) {
            dx = 0;
            dy = 0;
        }
        var left, top;
        top = this.gamePlace.offsetHeight / 2 - player.y * SPRITE_HEIGHT + SPRITE_HEIGHT / 2 -
                Math.round(dy);
        left = this.gamePlace.offsetWidth / 2 - player.x * SPRITE_WIDTH - SPRITE_WIDTH / 2 -
                Math.round(dx);
        if (left > 0) {
            left = 0;
        }
        if (left < this.gamePlace.offsetWidth - this.table.offsetWidth) {
            left = this.gamePlace.offsetWidth - this.table.offsetWidth;
        }
        if (top > 0) {
            top = 0;
        }
        if (top < this.gamePlace.offsetHeight - this.table.offsetHeight) {
            top = this.gamePlace.offsetHeight - this.table.offsetHeight;
            
        }
        
        this.table.style.left = left + "px";
        this.table.style.top = top + "px";
        
    },
    initMap: function () {
        "use strict";
        var i, j;
        this.height = textMap.length;
        this.width = textMap[0].length;
        this.gamePlace = document.getElementById("gamePlace");
        this.gamePlace.innerHTML = makeGameTable(this.width, this.height);
        this.table = document.getElementById("gameTable");
        for (i = 0; i < this.height; i += 1) {
            this.floorObjects[i] = [];
            for (j = 0; j < this.width; j += 1) {
                /*switch (textMap[i][j]) {
                case "*":
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.wall);
                    break;
                case "j":
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.floorWithJug);
                    break;
                case "d":
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.floorWithDoor);
                    break;
                case "e":
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.exit);
                    break;
                default:
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.floor);
                    break;
                }*/
                if (floorType.isValidType(textMap[i][j])) {
                    this.floorObjects[i][j] = new FloorObject(j, i, textMap[i][j]);
                }
            }
        }
        for (i = 0; i < this.height; i += 1) {
            for (j = 0; j < this.width; j += 1) {
                this.floorObjects[i][j].computeSprite();
            }
        }
        player.initPlayer();
//        player.setPosition(PLAYER_X, PLAYER_Y);
//        player.setDirection(Direction.up);
        this.posCamera();
        document.body.onkeydown = this.oKey;
        document.body.onkeyup = this.oKey;
    },
    reinitMap: function () {
        "use strict";
        var i, j;
//        player.x = PLAYER_X;
//        player.y = PLAYER_Y;
//        player.direction = Direction.up;
//        player.changeSprite();
        player.initPlayer();
        for (i = 0; i < this.height; i += 1) {
            for (j = 0; j < this.width; j += 1) {
                this.floorObjects[i][j].restory();
            }
        }
        this.posCamera();
    }
};

function gameOver(dead) {
    "use strict";
    var s;
    if (dead !== true) {
        s = "Лабиринт пройден. Хотите начать с начала?";
    } else {
        s = "Вы умерли. Хотите начать с начала";
    }
    if (confirm(s)) {
        map.reinitMap();
    }
}



function main() {
    "use strict";
    map.initMap();


}
main();