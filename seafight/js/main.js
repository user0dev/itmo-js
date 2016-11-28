/*jslint devel: true */

var youFieldArr;
var enemyFieldArr;
var youFieldId = "youField";
var enemyFieldId = "enemyField";
var youShipCount;
var enemyShipCount;
var maxShips;
var shipsArray = [4, 3, 2, 1];

var WIDTH = 10; // maxX
var HEIGHT = 10; // maxY
var Status = {
    empty: 0, // пустая ячейка
    ship: 1, // корабль
    fail: 2, //место промаха
    success: 3, //место попадания
    block: 4, //место где не может быть карабля потому что он в соседней ячейке. 
    wreck: 5  //утонувший корабль
};


function randomInt(max) {
    "use strict";
    max = +max;
    return Math.floor(Math.random() * (max));
}

function makeField(caption, id) {
    "use strict";
    var result, y, x, idStr, ocStr;
    result = "<table id=\"" + id + "\"><caption>" + caption + " <span id=\"" + id + "_ship\"></span></caption>\n";
    for (y = 0; y < HEIGHT; y += 1) {
        result += "<tr>";
        for (x = 0; x < WIDTH; x += 1) {
            idStr = " id=\"" + id + "_" + x + "_" + y + "\" ";
            ocStr = " onclick=\"oclick('" + id + "', " + x + ", " + y + ");\" ";
            result += "<td " + idStr + ocStr + ">" + "</td>";
        }
        result += "</tr>\n";
    }
    result += "</table>\n";
    return result;
}


function initField() {
    "use strict";
    var i, j, field;
    field = [];
    for (i = 0; i < HEIGHT; i += 1) {
        field[i] = [];
        for (j = 0; j < WIDTH; j += 1) {
            field[i][j] = Status.empty;
        }
    }
    return field;

}

// проверка можно ли поставить квадратик коробля в заданную клетку.
// true - клетка доступна для установки, false -  не доступна.
function canSetShip(field, x, y) {
    "use strict";
    var i, j;
    for (i = x - 1; i <= x + 1; i += 1) {
        if (i >= 0) {
            if (i >= WIDTH) {
                break;
            }
            for (j = y - 1; j <= y + 1; j += 1) {
                if (j >= 0) {
                    if (j >= HEIGHT) {
                        break;
                    }
                    if (field[j][i] === Status.ship) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

// можно ли поставить корабль в заданную клетку. length - количество квадратиков.
// true - нельзя поставить, false - можно
function conflictShip(field, length, x, y, vertical) {
    "use strict";
    var i, maxX, maxY;
    if (x < 0 || y < 0) {
        return true;
    }
    if (vertical === true) {
        maxX = WIDTH - 1;
        maxY = HEIGHT - length;
    } else {
        maxX = WIDTH - length;
        maxY = HEIGHT - 1;
    }
    if (x > maxX || y > maxY) {
        return true;
    }
    for (i = 0; i < length; i += 1) {
        if (vertical === true) {
            if (canSetShip(field, x, y + i) === false) {
                return true;
            }
        } else {
            if (canSetShip(field, x + i, y) === false) {
                return true;
            }
        }
    }
    return false;
}

function setShip(field, length, x, y, vertical, test) {
    "use strict";
    var i;
    if (test) {
        if (conflictShip(field, length, x, y)) {
            return false;
        }
    }
    for (i = 0; i < length; i += 1) {
        if (vertical) {
            field[y + i][x] = Status.ship;
        } else {
            field[y][x + i] = Status.ship;
        }
    }
}

//разместить корабли случайно на заданном поле
function genShipOnField(field) {
    "use strict";
    var ships, i, j, x, y, vertical;
    ships = shipsArray;
    for (i = ships.length - 1; i >= 0; i -= 1) {
        j = ships[i];
        while (j > 0) {
            x = randomInt(WIDTH);
            y = randomInt(HEIGHT);
            vertical = Math.random() >= 0.5;
            if (!conflictShip(field, i + 1, x, y, vertical)) {
                j -= 1;
                setShip(field, i + 1, x, y, vertical);
            }
        }
    }
}

// просто проверяет возможно ли выстрелить в эту клетку
function testShot(field, x, y) {
    "use strict";
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
        return false;
    }
    if (field[y][x] === Status.empty || field[y][x] === Status.ship) {
        return true;
    }
    return false;
}

function coordWrong(x, y) {
    "use strict";
    return x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT;
}

function getShipOnField(field) {
    "use strict";
    if (field === youFieldArr) {
        return youShipCount;
    } else if (field === enemyFieldArr) {
        return enemyShipCount;
    }
}

function setShipOnField(field, count) {
    "use strict";
    if (field === youFieldArr) {
        youShipCount = count;
    } else if (field === enemyFieldArr) {
        enemyShipCount = count;
    }
}

function makeWreckIfPossible(field, x, y) {
    "use strict";
    function findShip(dx, dy) {
        var i, j, s, r;
        i = x;
        j = y;
        do {
            i += dx;
            j += dy;
            if (coordWrong(i, j)) {
                return false;
            }
            s = field[j][i];
            if (s === Status.ship) {
                return true;
            }
        } while (s === Status.success);
        return false;
    }
    function makeBlock(bx, by) {
        var i, j;
        if (coordWrong(bx, by) || field[by][bx] !== Status.wreck) {
            return;
        }
        for (i = bx - 1; i <= bx + 1; i += 1) {
            if (i >= 0 && i < WIDTH) {
                for (j = by - 1; j <= by + 1; j += 1) {
                    if (j >= 0 && j < HEIGHT) {
                        if (field[j][i] === Status.empty) {
                            field[j][i] = Status.block;
                        }
                    }
                }
            }
        }
    }
    function makeWreck(dx, dy) {
        var i, j, s, r;
        i = x;
        j = y;
        r = false;
        do {
            if (coordWrong(i, j)) {
                return r;
            }
            s = field[j][i];
            if (s === Status.ship || s === Status.success) {
                r = true;
                field[j][i] = Status.wreck;
                makeBlock(i, j);
            }
            i += dx;
            j += dy;
        } while (s === Status.ship || s === Status.success || s === Status.wreck);
        return r;
    }
    var r;
    if (coordWrong(x, y)) {
        return false;
    }
    if (field[y][x] !== Status.success && field[y][x] !== Status.ship) {
        return false;
    }
    r = false;
    r = findShip(0, 1) || r;
    r = findShip(0, -1) || r;
    r = findShip(1, 0) || r;
    r = findShip(-1, 0) || r;
    if (r) {
        return false;
    }
    setShipOnField(field, getShipOnField(field) - 1);
    r = makeWreck(0, 1);
    r = makeWreck(0, -1) || r;
    r = makeWreck(1, 0) || r;
    r = makeWreck(-1, 0) || r;
    return r;
}

//todo
//пометить клетку корабля как подбитую. Если корабль подбит весь то перепометить его и ближайшие клетки
function markShip(field, x, y) {
    "use strict";
    if (coordWrong(x, y)) {
        return false;
    }
    if (field[y][x] !== Status.ship) {
        return false;
    }
    field[y][x] = Status.success;
    return makeWreckIfPossible(field, x, y);
    
    
}

function shot(field, x, y) {
    "use strict";
    if (!testShot(field, x, y)) {
        return false;
    }
    switch (field[y][x]) {
    case Status.ship:
        return markShip(field, x, y);
    case Status.empty:
        field[y][x] = Status.fail;
        break;
    default:
        return false;
    }
    return true;
}

function aiShot(field) {
    "use strict";
    var x, y;
    do {
        x = randomInt(WIDTH);
        y = randomInt(HEIGHT);
    } while (!testShot(field, x, y));
    console.log(shot(field, x, y));
}

function setFieldCell(id, x, y, status) {
    "use strict";
    var elem, idStr = id + "_" + x + "_" + y;
    elem = document.getElementById(idStr);
    //console.log(elem.tagName);
    switch (status) {
    case Status.ship:
        elem.style.backgroundColor = "green";
        break;
    case Status.empty:
        elem.style.backgroundColor = "lightblue";
        break;
    case Status.success:
        elem.style.backgroundColor = "red";
        break;
    case Status.fail:
        elem.style.backgroundColor = "gray";
        break;
    case Status.block:
        elem.style.backgroundColor = "lightgray";
        break;
    case Status.wreck:
        elem.style.backgroundColor = "black";
        break;
    }
}

function drawField(field, id, hidden) {
    "use strict";
    var i, j, idStr;
    idStr = id + "_ship";
    document.getElementById(idStr).textContent = getShipOnField(field);
    for (i = 0; i < HEIGHT; i += 1) {
        for (j = 0; j < WIDTH; j += 1) {
            if (hidden === true && field[i][j] === Status.ship) {
                setFieldCell(id, j, i, Status.empty);
            } else {
                setFieldCell(id, j, i, field[i][j]);
            }
        }
    }
}

function renewFields() {
    "use strict";
    youShipCount = maxShips;
    enemyShipCount = maxShips;
    youFieldArr = initField();
    enemyFieldArr = initField();
    genShipOnField(youFieldArr);
    genShipOnField(enemyFieldArr);
    drawField(youFieldArr, youFieldId);
    drawField(enemyFieldArr, enemyFieldId, true);
}

function oclick(id, x, y) {
    "use strict";
    if (id === enemyFieldId) {
        if (testShot(enemyFieldArr, x, y)) {
            shot(enemyFieldArr, x, y);
            aiShot(youFieldArr);
            drawField(youFieldArr, youFieldId);
            drawField(enemyFieldArr, enemyFieldId, true);
            if (enemyShipCount === 0 && youShipCount !== 0) {
                if (confirm("Вы победили. Хотите сыграть снова?")) {
                    renewFields();
                }
            } else if (enemyShipCount !== 0 && youShipCount === 0) {
                if (confirm("Вы проиграли. Хотите сыграть снова?")) {
                    renewFields();
                }
            } else if (enemyShipCount === 0 && youShipCount === 0) {
                if (confirm("Ничья. Хотите сыграть снова?")) {
                    renewFields();
                }
            }
        }
    }
    
}

function main() {
    "use strict";
    var i, j;
    document.getElementById("fields").innerHTML = makeField("Ваше поле", youFieldId) + "\n" +
                                            makeField("Поле противника", enemyFieldId);
    for (i = 0, j = 0; i < shipsArray.length; i += 1) {
        j += shipsArray[i];
    }
    maxShips = j;
    youShipCount = j;
    enemyShipCount = j;
    youFieldArr = initField();
    enemyFieldArr = initField();
    
    genShipOnField(youFieldArr);
    genShipOnField(enemyFieldArr);
    drawField(youFieldArr, youFieldId);
    drawField(enemyFieldArr, enemyFieldId, true);
}

main();