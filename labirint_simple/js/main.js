/*global randomInt, isNumber, isIntNumber, randomBool, textMap, FloorObject, map, PLAYER_X, PLAYER_Y, gameOver */
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
    var elements = [], makeInner, actived;
    elements[0] = map.getTableCell(x, y);
    this.getType = function () {
        return type;
    };
    actived = false;
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
        }
    };
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
    default:
        elements[0].style.backgroundPosition = spriteToBP(8, 6);
    }
    this.isStand = function () { //на эту клетку можно встать
        switch (this.getType()) {
        case floorType.floor:
            return true;
        case floorType.exit:
            return true;
        case floorType.floorWithDoor:
        case floorType.floorWithJug:
            return actived;
        }
        return false;
    };
    this.isAction = function () { //с этой клеткой можно произвести действие
        if (this.getType() === floorType.floorWithDoor || this.getType() === floorType.floorWithJug) {
            return !actived;
        } else {
            return false;
        }
        
    };
    this.action = function () {
        if (this.isAction) {
            if (elements[1] !== undefined) {
                if (this.getType() === floorType.floorWithDoor) {
                    elements[1].style.backgroundPosition = spriteToBP(7, 1);
                    actived = true;
                } else if (this.getType() === floorType.floorWithJug) {
                    elements[1].style.backgroundPosition = spriteToBP(7, 3);
                    actived = true;
                }
            }
        }
    };
    this.computeSprite = function () {
        if (this.getType() === floorType.wall) {
            if (y + 1 >= map.height || map.floorObjects[y + 1][x].getType() !== floorType.wall) {
                if (y - 1 < 0 || map.floorObjects[y - 1][x].getType() !== floorType.wall) {
                    elements[0].style.backgroundPosition = spriteToBP(8, 0);
                } else {
                    elements[0].style.backgroundPosition = spriteToBP(10, 0);
                }
            } else if (y - 1 < 0 || map.floorObjects[y - 1][x].getType() !== floorType.wall) {
                elements[0].style.backgroundPosition = spriteToBP(11, 0);
            }
        }
    };
    this.restory = function () {
        if (elements[1] !== undefined) {
            if (this.getType() === floorType.floorWithDoor) {
                elements[1].style.backgroundPosition = spriteToBP(4, 1);
                actived = false;
            } else if (this.getType() === floorType.floorWithJug) {
                elements[1].style.backgroundPosition = spriteToBP(4, 3);
                actived = false;
            }
        }
    };
}

var player = {
    x: 0,
    y: 0,
    element: null,
    direction: Direction.up,
    arrayForSprite: [],
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
    cancelAnimation: function () {
        "use strict";
        if (player.animId === null) {
            return;
        }
        window.cancelAnimationFrame(player.animId);
        player.animId = null;
        player.changeSprite();
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
        var start, dx, dy;
        var dir;
        if (newDir === undefined) {
            dir = this.direction;
        } else {
            dir = newDir;
        }
        if (dir === this.direction && this.animId !== null) {
            return;
        }
        
    //if (true) { //if (this.canIMove(dir)) {
        if (this.animId === null) {
            this.newDirection = null;
            dx = 0;
            dy = 0;
            this.direction = dir;
            this.stopAndWalk = !this.canIMove();
            player.element.style.backgroundPosition = player.arrayForSprite[this.direction][player.frame];
            start = performance.now();
            var oldTime = start;
            player.animId = window.requestAnimationFrame(function anim(time) {
                var dTime = time - oldTime;
                var dir = player.direction;
                oldTime = time;
                var ps = player.element.style;
                if (player.animId === null) {
                    return;
                }
                if (player.stopAndWalk) {
                    player.stopAndWalk = !player.canIMove();
                }
                if (time - start > 250) {
                    start = time;
                    player.frame = player.frame === 1 ? 2 : 1;
                    ps.backgroundPosition = player.arrayForSprite[dir][player.frame];
                }
                if (!player.stopAndWalk) {
                    dx += dirToX(dir) * dTime * 0.1;
                    dy += dirToY(dir) * dTime * 0.1;
                }
                if (Math.abs(dx) >= SW || Math.abs(dy) >= SH) {
                    //player.x += Math.floor(Math.abs(dx) / SW) * dirToX(dir);
                    //player.y += Math.floor(Math.abs(dy) / SH) * dirToY(dir);
                    player.x += dirToX(dir);
                    player.y += dirToY(dir);
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
                    dx = 0;
                    dy = 0;
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
                            ps.left = Math.round(player.x * SW + dx) + "px";
                            ps.top = Math.round(player.y * SH + dy) + "px";
                        }
                    }
                    //player.animationComplate();
                    //return;
                } else {
                    if (!player.stopAndWalk) {
                        ps.left = Math.round(player.x * SW + dx) + "px";
                        ps.top = Math.round(player.y * SH + dy) + "px";
                    }
                }


                player.animId = window.requestAnimationFrame(anim);
            });
        } else {
            if (this.stopAndWalk) {
                player.direction = dir;
                player.element.style.backgroundPosition = player.arrayForSprite[dir][player.frame];
                this.stopAndWalk = !this.canIMove();
            } else {
                this.newDirection = dir;
            }
        }
        /*this.changeSprite();
        map.posCamera();
        if (map.floorObjects[Math.round(this.y)][Math.round(this.x)].getType() === floorType.exit) {
            gameOver();
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
        this.arrayForSprite[Direction.up] = [];
        setSprites(this.arrayForSprite[Direction.up], 11);
        this.arrayForSprite[Direction.down] = [];
        setSprites(this.arrayForSprite[Direction.down], 8);
        this.arrayForSprite[Direction.left] = [];
        setSprites(this.arrayForSprite[Direction.left], 9);
        this.arrayForSprite[Direction.right] = [];
        setSprites(this.arrayForSprite[Direction.right], 10);
        var div;
        if (this.element === null) {
            div = document.createElement("div");
            this.element = div;
            div.id = "player";
            map.table.appendChild(div);
            div.style.backgroundPosition = this.arrayForSprite[this.direction][0];
            div.style.left = map.xToLeft(this.x);
            div.style.top = map.yToTop(this.y);
            
        }
    },
    changeSprite: function () {
        "use strict";
        this.element.style.backgroundPosition = this.arrayForSprite[this.direction][0];
        this.element.style.left = map.xToLeft(this.x);
        this.element.style.top = map.yToTop(this.y);
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
        ax = Math.round(this.x + dirToX(this.direction));
        ay = Math.round(this.y + dirToY(this.direction));
        if (map.coordCorrect(ax, ay) && map.floorObjects[ay][ax].isAction()) {
            map.floorObjects[ay][ax].action();
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
    
    oKey: function (e) {
        "use strict";
        switch (e.keyCode) {
        case 39:
        case 68:
            player.move(Direction.right);
            break;
        case 38:
        case 87:
            player.move(Direction.up);
            break;
        case 37:
        case 65:
            player.move(Direction.left);
            break;
        case 40:
        case 83:
            player.move(Direction.down);
            break;
        case 17:
        case 69:
            player.action();
            break;
        }
    },
    posCamera: function () {
        "use strict";
        var left, top;
        top = this.gamePlace.offsetHeight / 2 - player.y * SPRITE_HEIGHT + SPRITE_HEIGHT / 2;
        left = this.gamePlace.offsetWidth / 2 - player.x * SPRITE_WIDTH - SPRITE_WIDTH / 2;
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
        player.setPosition(PLAYER_X, PLAYER_Y);
        player.setDirection(Direction.up);
        this.posCamera();
        document.body.onkeydown = this.oKey;
    },
    reinitMap: function () {
        "use strict";
        var i, j;
        player.x = PLAYER_X;
        player.y = PLAYER_Y;
        player.direction = Direction.up;
        player.changeSprite();
        for (i = 0; i < this.height; i += 1) {
            for (j = 0; j < this.width; j += 1) {
                this.floorObjects[i][j].restory();
            }
        }
        this.posCamera();
    }
};

function gameOver() {
    "use strict";
    if (confirm("Лабиринт пройден. Хотите начать с начала?")) {
        map.reinitMap();
    }
}



function main() {
    "use strict";
    map.initMap();


}
main();