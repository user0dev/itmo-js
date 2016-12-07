/*global randomInt, isNumber, isIntNumber, randomBool, textMap, FloorObject, map */
var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;


var floorType = { wall: 0, floor: 1, floorWithDoor: 2 };
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
    var elements = [];
    elements[0] = map.getTableCell(x, y);
    this.type = type;
    switch (type) {
    case floorType.wall:
        elements[0].style.backgroundPosition = spriteToBP(9, 0);
        break;
    default:
        elements[0].style.backgroundPosition = spriteToBP(8, 6);
    }
    
    
    this.isStand = function () { //на эту клетку можно встать
        if (type === floorType.floor) {
            return true;
        }
        return false;
    };
    this.isAction = function () { //с этой клеткой можно произвести действие
        return false;
    };
    this.computeSprite = function () {
        
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
        }
    },
    initMap: function () {
        "use strict";
        var i, j;
        this.height = textMap.length;
        this.width = textMap[0].length;
        document.getElementById("gamePlace").innerHTML = makeGameTable(this.width, this.height);
        this.table = document.getElementById("gameTable");
        for (i = 0; i < this.height; i += 1) {
            this.floorObjects[i] = [];
            for (j = 0; j < this.width; j += 1) {
                switch (textMap[i][j]) {
                case "*":
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.wall);
                    break;
                default:
                    this.floorObjects[i][j] =  new FloorObject(j, i, floorType.floor);
                    break;
                }
            }
        }
        document.body.onkeydown = this.oKey;
    }
//    initFloor: function () {
//        "use strict";
//        var i, j;
//        for (i = 0; i < this.height; i += 1) {
//            this.floorObjects[i] = [];
//            for (j = 0; j < this.width; j += 1) {
//                this.floorObjects[i][j] = new FloorObject(j, i, this.map[i][j]);
//            }
//        }
//    }
};





function main() {
    "use strict";
    
    var table, i, j, tr;
    map.initMap();
    player.initPlayer();
    player.setPosition(0, 6);
    player.setDirection(Direction.right);
    //player.move();
//    for (i = 0; i < table.rows.length; i += 1) {
//        tr = table.rows[i];
//        for (j = 0; j < tr.cells.length; j += 1) {
//            tr.cells[j].style.backgroundPosition = randomBool() ? spriteToBP(8, 6) : spriteToBP(9, 0);
//        }
//    }
}
main();