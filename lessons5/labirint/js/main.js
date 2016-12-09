/*global randomInt, isNumber, isIntNumber, randomBool, textMap, FloorObject, map, PLAYER_X, PLAYER_Y, gameOver, performance */
/*jslint devel: true */

var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;


var floorType = { wall: 0, floor: 1, floorWithDoor: 2, floorWithJug: 3, exit: 4 };
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
var F = 0.15;

var player = {
    x: 0, // координаты в пикселях.
    y: 0, //
    element: null, //div с установленным фоном
    direction: Direction.up,
    arrayForSprite: [],
    canIMove: function (dir) { //проверка можно ли перейти по указанному направлению. 
        "use strict";
        //return true;
        if (dir === undefined) {
            dir = this.direction;
        }
        var x1, x2, y1, y2;
        switch (dir) {
        case Direction.left:
            x1 = Math.ceil(this.x) - 1;
            y1 = Math.floor(this.y);
            y2 = Math.ceil(this.y);
            if (Math.abs(y1 - this.y) < F) {
                return map.floorObjects[y1][x1].isStand();
            } else if (Math.abs(y2 - this.y) < F) {
                return map.floorObjects[y2][x1].isStand();
            } else {
                return map.floorObjects[y1][x1].isStand() && map.floorObjects[y2][x1].isStand();
            }
        case Direction.right:
//            newX = Math.floor(this.x) + 1;
//            newY = Math.round(this.y);
//            break;
            x1 = Math.floor(this.x) + 1;
            y1 = Math.floor(this.y);
            y2 = Math.ceil(this.y);
            if (Math.abs(y1 - this.y) < F) {
                return map.floorObjects[y1][x1].isStand();
            } else if (Math.abs(y2 - this.y) < F) {
                return map.floorObjects[y2][x1].isStand();
            } else {
                return map.floorObjects[y1][x1].isStand() && map.floorObjects[y2][x1].isStand();
            }
        case Direction.up:
//            newX = Math.round(this.x);
//            newY = Math.ceil(this.y) - 1;
//            break;
            x1 = Math.floor(this.x);
            x2 = Math.ceil(this.x);
            y1 = Math.ceil(this.y) - 1;
            if (Math.abs(x1 - this.x) < F) {
                return map.floorObjects[y1][x1].isStand();
            } else if (Math.abs(x2 - this.x) < F) {
                return map.floorObjects[y1][x2].isStand();
            } else {
                return map.floorObjects[y1][x1].isStand() && map.floorObjects[y1][x2].isStand();
            }
        case Direction.down:
//            newX = Math.round(this.x);
//            newY = Math.floor(this.y) + 1;
//            break;
            x1 = Math.floor(this.x);
            x2 = Math.ceil(this.x);
            y1 = Math.floor(this.y) + 1;
            if (Math.abs(x1 - this.x) < F) {
                return map.floorObjects[y1][x1].isStand();
            } else if (Math.abs(x2 - this.x) < F) {
                return map.floorObjects[y1][x2].isStand();
            } else {
                return map.floorObjects[y1][x1].isStand() && map.floorObjects[y1][x2].isStand();
            }
        }
        /*if (!map.coordCorrect(newX, newY)) {
            return false;
        }*/
        //return map.floorObjects[newY][newX].isStand();
        
    },
    move: function (dir) {
        "use strict";
        if (dir === undefined) {
            dir = this.direction;
        } else {
            this.direction = dir;
        }
        if (this.canIMove(dir)) {
            this.x += dirToX(dir);
            this.y += dirToY(dir);
            this.changeSprite();
            map.posCamera();
            if (map.floorObjects[Math.round(this.y)][Math.round(this.x)].getType() === floorType.exit) {
                gameOver();
            }
            return true;
        }
        this.changeSprite();
        return false;
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
        document.body.onkeydown = this.keyEvent;
        document.body.onkeyup = this.keyEvent;
        document.body.onkeypress = this.keyEvent;
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
//        var ax, ay;
//        ax = Math.round(this.x + dirToX(this.direction));
//        ay = Math.round(this.y + dirToY(this.direction));

        var newX, newY;
        switch (player.direction) {
        case Direction.left:
            newX = Math.ceil(this.x) - 1;
            newY = Math.round(this.y);
            break;
        case Direction.right:
            newX = Math.floor(this.x) + 1;
            newY = Math.round(this.y);
            break;
        case Direction.up:
            newX = Math.round(this.x);
            newY = Math.ceil(this.y) - 1;
            break;
        case Direction.down:
            newX = Math.round(this.x);
            newY = Math.floor(this.y) + 1;
            break;
        }
        
        if (map.coordCorrect(newX, newY) && map.floorObjects[newY][newX].isAction()) {
            map.floorObjects[newY][newX].action();
        }
    },
    frameNum: 0,
    frameTime: 0,
    moving: false,
    start: 0,
    animId: null,
    keyEvent: function (e) {
        "use strict";
        function setWalkSprite() {
            switch (player.direction) {
            case Direction.left:
                player.element.style.backgroundPosition = spriteToBP(player.frameNum, 9);
                break;
            case Direction.right:
                player.element.style.backgroundPosition = spriteToBP(player.frameNum, 10);
                break;
            case Direction.up:
                player.element.style.backgroundPosition = spriteToBP(player.frameNum, 11);
                break;
            case Direction.down:
                player.element.style.backgroundPosition = spriteToBP(player.frameNum, 8);
                break;
            }
        }
        function startAnimation() {
            player.frameNum = 1;
            player.frameTime = 0;
            player.moving = true;
            setWalkSprite();
            player.start = performance.now();
            if (player.animId === null) {
                player.animId = window.requestAnimationFrame(function anim(time) {
                    if (!player.moving) {
                        return;
                    }
                    var dtime = time - player.start;
                    player.start = time;
                    if (player.canIMove()) {
                        if (player.element !== null) {
                            switch (player.direction) {
                            case Direction.down:
                                player.y += dtime / (10 * 32);
                                player.element.style.top = Math.round(player.y * 32) + "px";
                                break;
                            case Direction.up:
                                player.y -= dtime / (10 * 32);
                                //player.y -= 1;
                                player.element.style.top = Math.round(player.y * 32) + "px";
                                break;
                            case Direction.left:
                                player.x -= dtime / (10 * 32);
                                player.element.style.left = Math.round(player.x * 32) + "px";
                                break;
                            case Direction.right:
                                player.x += dtime / (10 * 32);
                                player.element.style.left = Math.round(player.x * 32) + "px";
                                break;
                            }
                            map.posCamera();
                        }
                    }
                    //player.style.left = Math.round(x) + "px";
                    player.frameTime += dtime;
                    if (player.frameTime > 250) {
                        player.frameTime = 0;
                        player.frameNum = player.frameNum === 1 ? 2 : 1;
                        setWalkSprite();
                    }
                    player.animId = window.requestAnimationFrame(anim);
                });
            }
        }
        if (e.type === "keydown" && !e.repeat) {
            switch (e.key) {
            case "ArrowLeft":
                player.direction = Direction.left;
                if (!player.moving) {
                    startAnimation();
                }
                break;
            case "ArrowRight":
                player.direction = Direction.right;
                if (!player.moving) {
                    startAnimation();
                }
                break;
            case "ArrowUp":
                player.direction = Direction.up;
                if (!player.moving) {
                    startAnimation();
                }
                break;
            case "ArrowDown":
                player.direction = Direction.down;
                if (!player.moving) {
                    startAnimation();
                }
                break;
            }
        } else if (e.type === "keyup" && !e.repeat) {
            switch (e.key) {
            case "e":
            case "Control":
                player.action();
                break;
            }
            player.frameNum = 0;
            player.moving = false;
            setWalkSprite();
            if (player.animId !== null) {
                window.cancelAnimationFrame(player.animId);
                player.animId = null;
            }
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
                switch (textMap[i][j]) {
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
        //document.body.onkeydown = this.oKey;
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