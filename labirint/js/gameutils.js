/*global Point, floorType, Direction, Dr, SW, SH, SPRITE_WIDTH, SPRITE_HEIGHT, spriteToBP */

/*global randomInt, isNumber, isIntNumber, randomBool */



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
        
    }
};

var Direction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};
var Dr = Direction;


