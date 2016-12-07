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
    bpText: spriteToBP(11, 0),
    canIMove: function (dir) {
        "use strict";
        if (dir === undefined) {
            dir = this.direction;
        }
        var newX, newY;
        newX = this.x + dirToX(dir);
        newY = this.y + dirToY(dir);
        if (map.coordCorrect(newX, newY)) {
            return false;
        }
        return map.floorObjects[newY][newX].isStand();
    },
    move: function (dir) {
        "use strict";
        if (dir === undefined) {
            dir = this.direction;
        }
        if (this.canIMove(dir)) {
            this.x += dirToX(dir);
            this.y += dirToY(dir);
        }
    },
    changeDirection: function (direction) {
        "use strict";
        this.direction = direction;
    },
    initPlayer: function () {
        "use strict";
    },
    changeSprite: function () {
        "use strict";
        var div;
        if (this.element === null) {
            div = document.createElement("div");
            div.id = "player";
            map.table.appendChild(div);
            div.style.backgroundPosition = spriteToBP(0, 10);
        }
        switch (this.direction) {
            case Direction.up:
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
    coordToPosX: function (x) {
        "use strict";
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
                    this.floorObjects =  new FloorObject(j, i, floorType.wall);
                    break;
                default:
                    this.floorObjects =  new FloorObject(j, i, floorType.floor);
                    break;
                }
            }
        }
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
    player.changeSprite();
//    for (i = 0; i < table.rows.length; i += 1) {
//        tr = table.rows[i];
//        for (j = 0; j < tr.cells.length; j += 1) {
//            tr.cells[j].style.backgroundPosition = randomBool() ? spriteToBP(8, 6) : spriteToBP(9, 0);
//        }
//    }
}
main();