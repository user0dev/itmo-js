/*global HTMLTableElement */
/*global randomInt, isNumber, isIntNumber, randomBool */

/*jslint devel: true*/

var Direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};
Object.defineProperties(Direction, {
    up: {enumerable: true, writable: false, configurable: false},
    down: {enumerable: true, writable: false, configurable: false},
    left: {enumerable: true, writable: false, configurable: false},
    right: {enumerable: true, writable: false, configurable: false}
});


//класс координат. 
function Point(x, y) {
    "use strict";
    if (x === undefined) {
        x = 0;
    }
    if (y === undefined) {
        y = 0;
    }
    this.x = x;
    this.y = y;
    this.isEqual = function (point) {
        if (point instanceof Point) {
            return this.x === point.x && this.y === point.y;
        } else {
            return false;
        }
        
    };
    this.moveTo = function (direction, distance) {
        if (distance === undefined) {
            distance = 1;
        }
        if (direction !== undefined) {
            switch (direction) {
            case Direction.up:
                this.y -= distance;
                break;
            case Direction.down:
                this.y += distance;
                break;
            case Direction.left:
                this.x -= distance;
                break;
            case Direction.right:
                this.x += distance;
                break;
            }
        }
        return this;
    };
    this.movedPoint = function (direction, distance) {
        var point = new Point(this.x, this.y);
        point.moveTo(direction, distance);
        return point;
    };
}

var table = null;
var inputWidth = null;
var inputHeight = null;
var btGenerate = null;
var btClear = null;
var lab = null;

//создает лабиринт. true пол, false стена.


function Labyrinth(width, height) {
    "use strict";
    var self, sLab, stack, freeCount;
    self = this;
    this.matrix = null;
    sLab = null;
    freeCount = 0;
    stack = [];
    this.width = 0;
    this.height = 0;
    
    
    if (width > 3 && height > 3) {
        if (width % 2 === 0) {
            width -= 1;
        }
        if (height % 2 === 0) {
            height -= 1;
        }
    } else {
        width = 3;
        height = 3;
    }
    function coordRight(point) {
        if (self.matrix === null || width <= 0 || height <= 0) {
            return false;
        }
        return point.x >= 0 && point.y >= 0 && point.x < width && point.y < height;
    }
    function pointToShPoint(point) {
        return new Point((point.x - 1) / 2, (point.y - 1) / 2);
    }
    function shPointToPoint(shPoint) {
        return new Point(shPoint.x * 2 + 1, shPoint.y * 2 + 1);
    }
    function createShadowLab() {
        var i, j, r = [], w, h, lab;
        if (self.matrix === null) {
            return false;
        }
        lab = self.matrix;
        h = (lab.length - 1) / 2;
        w = (lab[0].length - 1) / 2;
        freeCount = 0;
        //h = lab.length;
        //w = lab[0].length;
        for (i = 0; i < h; i += 1) {
            r[i] = [];
            for (j = 0; j < w; j += 1) {
                r[i][j] = true;
                freeCount += 1;
            }
        }
        sLab = r;
        return true;
    }
    function isFree(point) {
        var shP;
        if (self.matrix === null || sLab === null || !coordRight(point)) {
            return false;
        }
        shP = pointToShPoint(point);
        return sLab[shP.y][shP.x];
    }
    function existFree() {
        var i, j;
/*        if (sLab === null) {
            return false;
        }
        for (i = 0; i < sLab.length; i += 1) {
            for (i)
        }*/
        return freeCount > 0;
    }

    function markNotFree(point) {
        var p;
        if (sLab === null || point === undefined || !coordRight(point)) {
            return false;
        }
        if (point.x % 2 !== 1 || point.y % 2 !== 1) {
            return false;
        }
        p = pointToShPoint(point);
        if (sLab[p.y][p.x]) {
            sLab[p.y][p.x] = false;
            freeCount -= 1;
            return true;
        } else {
            return false;
        }
    }

    function listFreeNeighbor(point) {
        var result, i, p;
        result = [];
        if (point === undefined || self.matrix === null || !coordRight(point)) {
            return result;
        }
        for (i = 0; i < 4; i += 1) {
            p = point.movedPoint(i, 2);
            if (coordRight(p)) {
                if (isFree(p)) {
                    result.push(p);
                }
            }
        }
        return result;
    }
    
    function removeWall(point1, point2) {
        var b, e;
        if (point1 === undefined && point2 === undefined && point1.isEqual(point2)) {
            return false;
        }
        if (!coordRight(point1) || !coordRight(point2)) {
            return false;
        }
        if (point1.x === point2.x) {
            b = Math.min(point1.y, point2.y);
            /*e = Math.max(point1.y, point2.y);
            for (b += 1; b < e; b += 1) {
                self.matrix[b][point1.x] = true;
            }*/
            b += 1;
            self.matrix[b][point1.x] = true;
            //table.rows[b].cells[point1.x].style.backgroundColor = "white";
            return true;
        } else if (point1.y === point2.y) {
            b = Math.min(point1.x, point2.x);
            b += 1;
            self.matrix[point1.y][b] = true;
            //table.rows[point1.y].cells[b].style.backgroundColor = "white";
            return true;
        } else {
            return false;
        }
    }
    function getRandomFree() {
        var points = [], i, j;
        if (existFree) {
            for (i = 0; i < sLab.length; i += 1) {
                for (j = 0; j < sLab[i].length; j += 1) {
                    if (sLab[i][j]) {
                        points.push(shPointToPoint(new Point(j, i)));
                    }
                }
            }
            if (points.length > 0) {
                return points[randomInt(points.length)];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    this.generateLabyrinth = function (beginPoint) {
        var curP, freeN, p;
        if (beginPoint === undefined || self.matrix === null ||
                sLab === null || !coordRight(beginPoint)) {
            return false;
        }
        curP = beginPoint;
        if (!markNotFree(curP)) { // если не пометилась как свободная то не продолжать
            return false;
        }
        while (existFree()) {
            freeN = listFreeNeighbor(curP);
            if (freeN.length > 0) {
                stack.push(curP);
                p = freeN[randomInt(freeN.length)];
                if (!removeWall(p, curP)) {
                    return false;
                }
                curP = p;
                if (!markNotFree(p)) {
                    return false;
                }
                
            } else if (stack.length > 0) {
                p = stack.pop();
                curP = p;
            } else {
                curP = getRandomFree();
                if (curP === null) {
                    return false;
                }
                if (!markNotFree(curP)) {
                    return false;
                }
            }
        }
        return true;
    };
    
    this.makeBeginMatrix = function () {
        var i, j;
        if (width === undefined || height === undefined) {
            return false;
        }
//        if (self.matrix === null) {
//            self.matrix = [];
//        }
        self.matrix = [];
        for (i = 0; i < height; i += 1) {
//            if (self.matrix[i] === undefined) {
//                self.matrix[i] = [];
//            }
            self.matrix[i] = [];
            for (j = 0; j < width; j += 1) {
                if (i % 2 === 0 || j % 2 === 0) {
                    self.matrix[i][j] = false;
                } else {
                    self.matrix[i][j] = true;
                }
            }
        }
        return createShadowLab();

    };
    this.resize = function (newWidth, newHeight) {
        if (newWidth === undefined || newHeight === undefined) {
            return false;
        }
        if (newWidth < 3 || newHeight < 3 || newWidth % 2 !== 1 || newHeight % 2 !== 1) {
            return false;
        }
        width = newWidth;
        height = newHeight;
        this.makeBeginMatrix();
    };

    
    if (width > 0 && height > 0) {
        this.makeBeginMatrix();
        
    }
    Object.defineProperties(this, {
        width: {
            get: function () {
                return width;
            },
            set: function (value) {
                this.resize(value, height);
            }
        },
        height: {
            get: function () {
                return height;
            },
            set: function (value) {
                this.resize(width, value);
            }
        }
    });
}






function showLabyrinth(table, labyrinth) {
    "use strict";
    var l, i, j, r, c;
    //lab = labyrinth.matrix;
    console.log("draw lab");
    if (!(table instanceof HTMLTableElement && labyrinth instanceof Labyrinth)) {
        return false;
    }
    if (table.rows.length < labyrinth.height) {
        l = labyrinth.height - table.rows.length;
        for (i = 0; i < l; i += 1) {
            table.insertRow();
        }
    } else if (table.rows.lenght > labyrinth.height) {
        l = table.row.lenght - labyrinth.height;
        for (i = 0; i < l; i += 1) {
            table.deleteRow(-1);
        }
    }
    for (i = 0; i < labyrinth.width; i += 1) {
        r = table.rows[i];
        l = r.cells.length - labyrinth.width;
        if (l < 0) {
            l = -l;
            for (j = 0; j < l; j += 1) {
                r.insertCell(-1);
            }
        } else if (l > 0) {
            for (j = 0; j < l; j += 1) {
                r.deleteCell(-1);
            }
        }
    }
    for (i = 0; i < table.rows.length; i += 1) {
        for (j = 0; j < table.rows[i].cells.length; j += 1) {
            c = table.rows[i].cells[j];
            if (labyrinth.matrix[i][j]) {
                c.style.background = "white";
            } else {
                c.style.background = "black";
            }
        }
    }
}

function changeSize(event) {
    "use strict";
    if (event.currentTarget.value % 2 === 1) {
        if (event.currentTarget === inputWidth) {
            lab.width = event.currentTarget.value;
        }
        if (event.currentTarget === inputHeight) {
            lab.height = event.currentTarget.value;
        }
        showLabyrinth(table, lab);
        //return true;
    } else {
        return false;
    }
}

function main() {
    "use strict";
    lab = new Labyrinth(3, 3);
    table = document.getElementById("labyrinth");
    btClear = document.getElementById("clear");
    btGenerate = document.getElementById("generate");
    inputWidth = document.getElementById("inWidth");
    inputHeight = document.getElementById("inHeight");
    inputWidth.addEventListener("change", changeSize);
    inputHeight.addEventListener("change", changeSize);
    btGenerate.addEventListener("click", function () {
        lab.makeBeginMatrix();
        lab.generateLabyrinth(new Point(1, 1));
        showLabyrinth(table, lab);
    });
    
    
    //console.dir(table);
    showLabyrinth(table, lab);
    
}
main();