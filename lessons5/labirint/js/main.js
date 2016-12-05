/*global randomInt, isNumber, isIntNumber */
var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;

//объект который может отображать себя на карте. С анимацией. Универсальный обьект для всего.
//координаты не обязательно целые числа. Но для большинства объектов болжны быть целые.
//это координаты на игровом поле, а не на экране.
//spriteIndex - id в массиве спрайтов. По умолчанию 0. Надеюсь и единственным останется.
//cyclAnim - true если нужне проигрывать анимацию постоянно. не обязательно. по умолчанию false.
//animPeriod периуд переключения анимации относительно общего периуда. по умолчанию 1. Может быть дробным
//pictures - массив вида [x, y, x2, y2 и т.д]. Если значения кординат NaN значит ничего не отображать
//это не настоящие координаты. Реальные пиксели на картинке вычисляются x * SPRITE_WIDTH и т.д
function GraphicObject(spriteIndex, pictures, cyclAnim, animPeriod) {
    "use strict";
    if (cyclAnim === undefined) {
        cyclAnim = false;
    }
    if (animPeriod === undefined) {
        animPeriod = 1;
    }
    this.isAnimation = function() {
        return pictures.length > 1;
    }
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    if (pictures === undefined) {
        pictures = [];
    }
    /*this._x = x;
    this._y = y;
    this._pictures = pictures;
    this._cyclAnim = c*/
}

var map = {
    gObjects: {},
    initGObjectsArray: function () {
        "use strict";
        gObject.land = new GraphicObject(0, [{x: 15, y: 2}])
    }
};





function main() {
    "use strict";
    
}