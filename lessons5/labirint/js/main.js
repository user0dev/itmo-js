/*global randomInt, isNumber, isIntNumber, randomBool, textMap */
var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;


var floorType = { wall: 0, floor: 1, floorWithDoor: 2 };

function spriteToBP(x, y) {
    "use strict";
    return x * -SPRITE_WIDTH + "px " + y * -SPRITE_HEIGHT + "px";
}

function FloorObject(x, y, type) {
    "use strict";
    var elements = [];
    elements = map.getTableCell(x, y);
}


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
    map: [],
    floorObjects: [],
    initMap: function () {
        "use strict";
        var i, j;
        this.height = textMap.length;
        this.width = textMap[0].length;
        document.getElementById("gamePlace").innerHTML = makeGameTable(this.width, this.height);
        this.table = document.getElementById("gameTable");
        for (i = 0; i < this.height; i += 1) {
            this.map[i] = [];
            for (j = 0; j < this.width; j += 1) {
                switch (textMap[i][j]) {
                case "*":
                    this.map = floorType.wall;
                    break;
                default:
                    this.map = floorType.floor;
                }
            }
        }
    },
    initFloor: function () {
        "use strict";
        var i, j;
        for (i = 0; i < this.height; i += 1) {
            this.floorObjects[i] = [];
            for (j = 0; j < this.width; j += 1) {
                this.floorObjects[i][j] = new FloorObject(j, i, this.map[i][j]);
            }
        }
    }
};





function main() {
    "use strict";
    
    var table, i, j, tr;
    
//    for (i = 0; i < table.rows.length; i += 1) {
//        tr = table.rows[i];
//        for (j = 0; j < tr.cells.length; j += 1) {
//            tr.cells[j].style.backgroundPosition = randomBool() ? spriteToBP(8, 6) : spriteToBP(9, 0);
//        }
//    }
}
main();