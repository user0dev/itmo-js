/*global Point, spriteToBT, Animation, mainGraphic, Sprite, makeAnimationOne, GraphicObject, LAYERS */

/*gloabl performance */
/*jslint devel: true */
/*jslint nomen: true */
/*jslint vars: true */

var SPRITE_WIDTH = 32;
var SPRITE_HEIGHT = 32;
var SW = SPRITE_WIDTH; //ширина спрайта
var SH = SPRITE_HEIGHT; //высота спрайта


//преобразование координат спрайта в строку background-position
function spriteToBP(x, y) {
    "use strict";
    return x * -SPRITE_WIDTH + "px " + y * -SPRITE_HEIGHT + "px";
}

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
}

function Sprite(pointOrX, y) {
    "use strict";
    var self = this;
    if (typeof pointOrX === "number") {
        if (typeof y === "number") {
            this.coord = new Point(pointOrX, y);
        } else {
            this.coord = new Point(0, 0);
        }
    } else if (pointOrX instanceof Point) {
        this.coord = pointOrX;
    } else {
        this.coord = new Point(0, 0);
    }
    this.getBackgroundPosition = function () {
        return spriteToBP(this.coord.x, this.coord.y);
    };
}


//описание анимации
function Animation(sprites, period) {
    "use strict";
    if (Array.isArray(sprites)) {
        if (sprites.length === 0) {
            this.sprites = [new Sprite()];
        } else {
            this.sprites = sprites;
        }
    } else if (sprites instanceof Sprite) {
        this.sprites = [sprites];
    } else {
        this.sprites = [new Sprite()];
    }
    if (period !== undefined) {
        this.period = period;
    } else {
        this.period = 0;
    }
    this.isOneFrame = function () {
        return this.sprites.length === 1;
    };
}

function makeAnimatonOne(x, y) {
    "use strict";
    return new Animation(new Sprite(x, y));
}

var LAYERS = {
    FLOOR: 0,
    FLOOR_MOD: 1,
    OBJECT_ON_FLOOR: 2,
    CREATURES: 3,
    SPECIAL_EFFECT: 4,
    INTERFACE: 5
};

//animaton не обязательно, тогда ничего не отобразится.
//объект сам задает себе анимацию по необходимости
function GraphicObject(coord, layer, animation, enabled) {
    "use strict";
    var self = this;
    if (enabled === undefined) {
        this._enabled = false;
    } else {
        this._enabled = enabled;
    }
    if (layer === undefined) {
        this._layer = 0;
    } else {
        this._layer = layer;
    }
    if (coord === undefined) {
        this._coord = new Point();
    } else {
        this._coord = coord;
    }
    if (animation === undefined) {
        this._animation = new Animation();
    } else {
        this._animation = animation;
    }
    
    this._frame = 0;
    var animId = null;
    this._repeat = false;
    

    function updateSprite() {
        var spr = self._animation.sprites;
        if (self._frame >= spr.length) {
            self._frame = 0;
        }
        self._elem.style.backgroundPosition = spr[self._frame].getBackgroundPosition();
    }
    this.nextFrame = function () {
        if (!this.isCanAnimate()) {
            return;
        }
        this._frame += 1;
        if (this._frame < 0) {
            this._frame = 0;
        }
        if (this._frame >= this._animation.sprites.length) {
            this._frame = 0;
        }
        updateSprite();
    };
    function stopAnimationFrames() {
        if (self.animId !== null) {
            window.cancelAnimationFrame(self.animId);
            self.animId = null;
        }
    }
    function startAnimationFrames() {
        var start = window.performance.now();
        self.animId = window.requestAnimationFrame(function anim(time) {
            if (self.animId === null) {
                return;
            }
            if (!self._enabled) {
                return;
            }
            var dTime = time - start;
            if (self._animation.period < dTime) {
                start = time;
                self.nextFrame();
            }
            self.animId = window.requestAnimationFrame(anim);
        });
    }
    
    this._elem = document.createElement("div");
    this._elem.classList.add("sprite");
    if (mainGraphic.field !== null) {
        mainGraphic.field.appendChild(this._elem);
    }
    updateSprite();
      
    this.setAnimation = function (animation, started, repeat) {
        
    };
    this.setCoord = function (coord) {
        if (coord === undefined) {
            return;
        }
        if (!this._coord.isEqual(coord)) {
            this._coord = coord;
            this._elem.style.left = coord.x + "px";
            this._elem.style.top = coord.y + "px";
        }
    };
    this.isEnabled = function () {
        return this._enabled;
    };
    this.enable = function (enable) {
        if (typeof enable !== "boolean") {
            enable = !this._enabled;
        }
        if (enable !== this._enabled) {
            this._enabled = enable;
            this._elem.hidden = enable;
        }
    };
    this.startAnimation = function (repeat) {
        if (repeat === undefined) {
            repeat = false;
        }
        if (!this.isCanAnimate() && this._animation.period === 0) {
            return;
        }
        startAnimationFrames();
    };
    this.stopAnimation = function () {
        stopAnimationFrames();
    };
    this.isCanAnimate = function () {
        return !this._animation.isOneFrame();
    };
}

var mainGraphic = {
    view: null,
    field: null,
    initGraphic: function (idContainer) {
        "use strict";
        this.view = document.createElement("div");
        this.view.style.overflow = "hidden";
        this.field = document.createElement("div");
        this.field.style.display = "relative";
        this.view.appendChild(this.field);
        this.view.style.width = "100%";
        this.view.style.height = "100%";
        if ((typeof idContainer) === "string" && document.getElementById(idContainer) !== null) {
            document.getElementById(idContainer).appendChild(this.view);
        } else {
            this.view.style.position = "absolute";
            document.body.appendChild(this.view);
        }
        return this.view;
    }
};


