/*global randomInt, isNumber, isIntNumber, randomBool, textMap, FloorObject, map, PLAYER_X, PLAYER_Y, gameOver, performance */

/*global Point, floorType, Direction, Dr, SW, SH, SPRITE_WIDTH, SPRITE_HEIGHT, spriteToBP */

/*global Point, spriteToBT, Animation, mainGraphic, Sprite, makeAnimationOne, GraphicObject, LAYERS */


/*jslint devel: true */
/*jslint nomen: true */
/*jslint vars: true */



function FloorObject(x, y, type) {
    "use strict";
    var elements = [], makeInner, actived, opened, startAnimation, start = 0;
    elements[0] = map.getTableCell(x, y);
    this.getType = function () {
        return type;
    };
    actived = false;
    opened = false;
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
            return opened;
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
    startAnimation = function () {
        var spY = 0, spX, animId = null;
        if (type === floorType.floorWithDoor) {
            spY = 1;
        } else if (type === floorType.floorWithJug) {
            spY = 3;
        }
        start = performance.now();
        spX = 5;
        elements[1].style.backgroundPosition = spriteToBP(spX, spY);
        animId = window.requestAnimationFrame(function anim(time) {
            var dtime;
            if (opened) {
                return;
            }
            dtime = time - start;
            if (dtime > 100) {
                start = time;
                spX += 1;
                if (spX < 7) {
                    elements[1].style.backgroundPosition = spriteToBP(spX, spY);
                } else {
                    opened = true;
                    elements[1].style.backgroundPosition = spriteToBP(7, spY);
                    window.cancelAnimationFrame(animId);
                    return;
                }
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
            startAnimation();
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




function Creature(mainSprite, deadSprite, x, y, direction) {
    "use strict";
/*todo проверка на правильность параметров*/
    var self = this;
    this._x = x;
    this._y = y;
    this._dir = direction;
    this._elem = document.createElement("div");
    this._elem.classList.add();
    this.canIMove = function (direction) {
        
    };
    this.isAlive = function () {
        
    };
    this.setPosition = function (x, y) {
        
    };
    this.moveToDir = function (direction) {
        
    };
    this.stopMove = function () {
        
    };
    this.action = function () {
        
    };
}

//function Monster()
/*
function Player(mainSprite, dead, direction) {
    "use strict";
    element: null, //div с установленным фоном
    direction: Direction.up,
    arrayForSprite: [],
    fixCoordX: function (x) {
        "use strict";
        x = Math.round(x);
        if (x % SW <= 5 || x % SW >= SW - 5) {
            x = round32(x);
        }
        return x;
    },
    fixCoordY: function (y) {
        "use strict";
        return this.fixCoordX(y);
    }, //x, y должны быть целочисленными. Желательно правильным образом округленными. В зависимости от направления.
    canIMove: function (dr) {
        "use strict";

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
        this.x = PLAYER_X * SPRITE_WIDTH;
        this.y = PLAYER_Y * SPRITE_HEIGHT;
        var div;
        if (this.element === null) {
            div = document.createElement("div");
            this.element = div;
            div.id = "player";
            map.table.appendChild(div);
            div.style.backgroundPosition = this.arrayForSprite[this.direction][0];
            div.style.left = this.x + "px";
            div.style.top = this.y + "px";
            
        }
        document.body.onkeydown = this.keyEvent;
        document.body.onkeyup = this.keyEvent;
    },
    changeSprite: function () {
        "use strict";
        this.element.style.backgroundPosition = this.arrayForSprite[this.direction][0];
//        this.element.style.left = map.xToLeft(this.x);
//        this.element.style.top = map.yToTop(this.y);
    },
    setPosition: function (x, y) {
        "use strict";
        this.x = x * SPRITE_WIDTH;
        this.y = y * SPRITE_HEIGHT;
        this.changeSprite();
    },
    action: function () {
        "use strict";
    },
    frameNum: 0,
    frameTime: 0,
    moving: false,
    start: 0,
    animId: null,
 
};
*/

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
    
//    oKey: function (e) {
//        "use strict";
//        switch (e.keyCode) {
//        case 39:
//        case 68:
//            player.move(Direction.right);
//            break;
//        case 38:
//        case 87:
//            player.move(Direction.up);
//            break;
//        case 37:
//        case 65:
//            player.move(Direction.left);
//            break;
//        case 40:
//        case 83:
//            player.move(Direction.down);
//            break;
//        case 17:
//        case 69:
//            player.action();
//            break;
//        }
//    },
    posCamera: function () {
        "use strict";
        var left, top;
        /*todo make player*/
        var player = {x: 0, y: 0};
        top = this.gamePlace.offsetHeight / 2 - player.y + SPRITE_HEIGHT / 2;
        left = this.gamePlace.offsetWidth / 2 - player.x - SPRITE_WIDTH / 2;
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
        //player.initPlayer();
        //player.setPosition(PLAYER_X, PLAYER_Y);
        //player.setDirection(Direction.up);
        this.posCamera();
        //document.body.onkeydown = this.oKey;
    },
    reinitMap: function () {
        "use strict";
        var i, j;
        /*player.x = PLAYER_X * SPRITE_WIDTH;
        player.y = PLAYER_Y * SPRITE_HEIGHT;
        player.direction = Direction.up;
        player.changeSprite();*/
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
    //map.initMap();
    mainGraphic.initGraphic();
    var lavaAnim = new Animation([new Sprite(7, 5), new Sprite(8, 5)], 1000);
    var go = new GraphicObject(new Point(), LAYERS.FLOOR, lavaAnim, true);
    go.startAnimation();
}
main();