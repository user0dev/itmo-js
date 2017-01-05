/*jslint devel: true, nomen: true */
/*global PRODUCTS, HTMLElement, Mustache */


//делает свойства неперечислимым
function modifyPropertyes(obj, descriptor, prop) {
    "use strict";
    var i;
    if (arguments.length > 2 && obj instanceof Object && descriptor instanceof Object) {
        for (i = 1; i < arguments.length; i += 1) {
            Object.defineProperty(obj, arguments[i], {enumerable: false});
        }
    }
}

function validUrl(url) {
    "use strict";
    //var urlregexp = /^(https?:\/\/)?[a-z\d-\.]+\.[a-z]{2,6}/i;
    //return urlregexp.test(url);
    return typeof url === "string" && url.trim() !== "";
}



//id - число уникальный идантификатор. cost - стоимоть >= 0, amount - колличество на складе >= 0
//img - картинка. Не обязательна. name - должна быть не пустой строкой не из пробелов
//если параметры не верные то id === null. 
function Item(id, name, cost, amount, img) {
    "use strict";
    
    
    if (typeof id !== "number") {
        this._setWrong();
    }
    if (typeof name !== "string" || name.trim() === "") {
        this._setWrong();
    }
    if (typeof cost !== "number" || cost < 0) {
        this._setWrong();
    }
    if (typeof amount !== "number" || amount < 0) {
        this._setWrong();
    }
    if (!validUrl(img)) {
        img = "images/no-image.png";
    }
    this.cost = cost;
    this.name = name;
    this.amount = amount;
    this.id = id;
    this.img = img;
    //modifyPropertyes(this, {writable: false, enumerable: true}, "img", "amount", "name", "cost", "id");
    modifyPropertyes(this, {enumerable: false}, "_setWrong", "isRight");
}

Item.prototype._setWrong = function () {
    "use strict";
    this.id = null;
    this.cost = 0;
    this.name = "";
    this.amount = 0;
    this.img = "";
};

Item.prototype.isRight = function () {
    "use strict";
    return this.id !== null;
};

//попытка поместить товаров в корзину больше чем на складе
//items - массив из элементов у которых привышено количество. 
function TooManyProductsError(items) {
    "use strict";
    this.items = items;
    this.name = "TooManyProductsError";
    this.message = "Недостаточно товаров на складе.";
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor); // (*)
    } else {
        this.stack = (new Error()).stack;
    }
}



function BasketArray() {
    "use strict";
    Array.apply(this, arguments);
}

BasketArray.prototype = Object.create(Array.prototype);
BasketArray.prototype.constructor = BasketArray;

BasketArray.prototype._change = function () {
    "use strict";
    //console.log("Array changed. Length: " + this.length);
    var event = document.createEvent("Event");
    event.initEvent("basket", true, true);
    event.basketArray = this;
    document.body.dispatchEvent(event);
};

BasketArray.prototype._computeSumm = function (index) {
    "use strict";
    if (typeof index === "number" && index >= 0 && index < this.length) {
        this[index].summ = this[index].count * this[index].cost;
        return true;
    } else {
        return false;
    }
};

BasketArray.prototype.remove = function (item, count) {
    "use strict";
    var ind;
    ind = this._findItem(item);
    if (ind > -1) {
        if (this[ind].count > count) {
            this[ind].count -= count;
            //this._computeSumm(ind);
        } else {
            this.splice(ind, 1);
        }
        this._change();
    }
};

BasketArray.prototype.removeById = function (id) {
    "use strict";
    var ind;
    ind = this._findItem(id);
    if (ind > -1) {
        this.splice(ind, 1);
        this._change();
    }
};

BasketArray.prototype.push = function (values) {
    "use strict";
    var result, i, ind, arr = [], tooManyList;
    tooManyList = [];
    for (i = 0; i < arguments.length; i += 1) {
        if (arguments[i] instanceof Item) {
            arr.push(arguments[i]);
        }
    }
    if (arr.length > 0) {
        for (i = 0; i < arr.length; i += 1) {
            ind = this._findItem(arr[i]);
            if (ind > -1) {
                if (this[ind].count < arr[i].amount) {
                    this[ind].count += 1;
                    //this[ind].summ = this[ind].count * this[ind].cost;
                } else {
                    tooManyList.push(arr[i]);
                }
            } else {
                if (arr[i].amount > 0) {
                    Array.prototype.push.call(this, this._itemToBasketItem(arr[i], 1));
                } else {
                    tooManyList.push(arr[i]);
                }
            }
        }
        //result = Array.prototype.push.apply(this, arr);
        if (tooManyList.length > 0) {
            throw new TooManyProductsError(tooManyList);
        } else {
            this._change();
        }
    }
    return this.length;
};
BasketArray.prototype.pop = function () {
    "use strict";
    var it, result;
    if (this.length > 0) {
        it = this[this.length - 1];
        if (it.count > 1) {
            it.count -= 1;
            //it.summ = it.count * it.cost;
        } else {
            Array.prototype.pop.call(this);
        }
        this._change();
    }
};
BasketArray.prototype._findItem = function (itemOrId) {
    "use strict";
    var i, id;
    if (itemOrId instanceof Item) {
        id = itemOrId.id;
    } else if (typeof itemOrId === "string") {
        id = parseInt(itemOrId, 10);
    } else if (typeof itemOrId === "number") {
        id = itemOrId;
    } else {
        return -1;
    }
    for (i = 0; i < this.length; i += 1) {
        if (this[i].id === id) {
            return i;
        }
    }
    return -1;
};

BasketArray.prototype._itemToBasketItem = function (item, count) {
    "use strict";
    var key, result;
    if (count === undefined) {
        count = 1;
    }
    if (item instanceof Item) {
        result = {};
        for (key in item) {
            if (item.hasOwnProperty(key)) {
                result[key] = item[key];
            }
        }
        result.count = count;
        //result.summ = result.count * result.cost;
        result.getSumm = function () {
            return this.count * this.cost;
        };
        return result;
    } else {
        return null;
    }
};

BasketArray.prototype.getCount = function (id) {
    "use strict";
    var ind;
    ind = this._findItem(id);
    if (ind > -1) {
        return this[ind].count;
    } else {
        return 0;
    }
};
BasketArray.prototype.setCount = function (id, count) {
    "use strict";
    var ind;
    if (typeof count !== "number" || count < 1) {
        return false;
    }
    ind = this._findItem(id);
    if (ind > -1) {
        if (this[ind].count !== count) {
            if (this[ind].amount > count) {
                this[ind].count = count;
                //this._computeSumm(ind);
                this._change();
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    return false;
};


modifyPropertyes(BasketArray.prototype, {enumerable: false}, "pop", "push", "constructor", "_change", "remove", "_itemToBasketItem", "_findItem");

function BasketViewer(element, basketArray) {
    "use strict";
    this._draw = BasketViewer.prototype.draw.bind(this);
    document.body.addEventListener("basket", this._draw);
    if (element instanceof HTMLElement) {
        this._element = element;
        //this._element.
    } else {
        this._element = null;
    }
/*    if (basketArray instanceof BasketArray) {
        this._basketArray = basketArray;
    } else {
        this._basketArray = null;
    }*/
}

BasketViewer.prototype.setDrawElement = function (element) {
    "use strict";
    if (element instanceof HTMLElement) {
        if (this._element instanceof HTMLElement) {
            this._element.removeEventListener("basket", this._draw);
        }
        this._element = element;
        this._element.addEventListener("basket", this._draw);
        return true;
    } else {
        return false;
    }
};

BasketViewer.prototype.draw = function (event) {
    "use strict";
    //console.log(event);
    var i, data, dataArray, summ;
    if (this._element === null) { // || this._basketArray === null) {
        return false;
    }
    if (event.type === "basket" && event.basketArray instanceof BasketArray) {
//        for (i = 0; i < event.basketArray.length; i += 1) {
//            console.log(event.basketArray[i]);
//        }
        dataArray = Array.prototype.slice.call(event.basketArray);
        //не понятно как обьяснить что BasketArray это массив 
        //console.log(dataArray);
        summ = 0;
        for (i = 0; i < dataArray.length; i += 1) {
            summ += dataArray[i].getSumm();
        }
        data = {"basket": dataArray, "totalsumm": summ};
        //console.log(data);
        this._element.innerHTML = Mustache.render(this.TEMPLATE, data);
    }
};

BasketViewer.prototype.TEMPLATE =
    "<table><tr>" +
    "<th></th><th>Название</th><th>Количество</th><th>Стоимость</th><th>Сумма</th>" +
    "<th></th></tr>{{#basket}}" +
        "<tr><td><img src=\"{{img}}\"></td><td>{{name}}</td>" +
    "<td><input key=\"{{id}}\" type=\"number\" value=\"{{count}}\" min=\"1\" max=\"{{amount}}\"></td>" +
    "<td>{{cost}} руб.</td><td>{{getSumm}} руб.</td>" +
    "<td><span key=\"{{id}}\" class=\"bsdel\">X</span></td></tr>" +
    "{{/basket}}<caption>Итого: {{totalsumm}} руб.</caption></table>";
    //"{{/basket}}</table><div class=\"total_summ\">Итого: {{totalsumm}} руб.</div>";

/*function BasketItem(item, count) {
    "use strict";
    this.item = item;
    this.count = count;
}

function Basket() {
    "use strict";
    var self, items;
    self = this;
    items = [];
    
    function getSumm() {
        var i, result = 0;
        for (i = 0; i < items.length; i += 1) {
            result += items[i].item.cost * items[i].count;
        }
        return result;
    }
    function findItem(item) {
        var i;
        for (i = 0; i < items.length; i += 1) {
            if (item === items[i].item) {
                return i;
            }
        }
        return -1;
    }
    this.summ = 0;
    this.addItem = function (item, count) {
        var index;
        if (count === undefined) {
            count = 1;
        }
        index = findItem(item);
        if (index === -1) {
            if (item.amount > 0) {
                items.push(new BasketItem(item, count));
                return true;
            } else {
                return false;
            }
        } else {
            if (item.amount >= items[index].count + count) {
                items[index].count += count;
                return true;
            } else {
                return false;
            }
        }
    };
    this.delItem = function (item, count) {
        var i;
        if (count === undefined) {
            count = 1;
        }
        i = findItem(item);
        if (i === -1) {
            return false;
        }
        if (items[i].count < count) {
            items.splice(i, 1);
            return false;
        } else if (items[i].count === count) {
            items.splice(i, 1);
            return true;
        } else {
            items[i].count -= count;
            return true;
        }
    };
    this.getItem = function (index) {
        return items[index].item;
    };
    this.getItemCount = function (index) {
        return items[index].count;
    };
    this.countItem = function (item) {
        var i;
        i = findItem(item);
        if (i === -1) {
            return 0;
        } else {
            return items[i].count;
        }
    };
    this.length = 0;
    Object.defineProperty(this, "summ", {get: getSumm});
    Object.defineProperty(this, "length", {get: function () {return items.length; }});
}
var basket = new Basket();*/

function ProductList() {
    "use strict";
    var self;
    self = this;
    this.list = [];
    function makeList() {
        var i, p, amount, img;
        for (i = 0; i < PRODUCTS.length; i += 1) {
            p = PRODUCTS[i];
            if (p.amount === undefined) {
                amount = 5;
            } else {
                amount = p.amount;
            }
            img = "images/" + p.eventProductId + "s.jpg";
            self.list.push(new Item(parseInt(p.eventProductId, 10), p.eventProductName,
                                    parseFloat(p.eventProductPrice), amount, img));
        }
    }
    makeList();
}
var productList = new ProductList();

function newElement(tag, attr, text) {
    "use strict";
    var result, key;
    if (typeof tag !== "string") {
        return null;
    }
    if (attr === undefined) {
        attr = {};
    }
    result = document.createElement(tag);
    for (key in attr) {
        if (attr.hasOwnProperty(key)) {
            result.setAttribute(key, attr[key]);
        }
    }
    if (text !== undefined) {
        result.textContent = text;
    }
    return result;
}

function makeCard(item) {
    "use strict";
    var e;
    e = newElement("div", {"class": "product"});
    e.appendChild(newElement("img", {"src": item.img}));
    e.appendChild(newElement("div", {"class": "name"}, item.name));
    e.appendChild(newElement("div", {"class": "cost"}, item.costToString()));
    e.appendChild(newElement("input", {"type": "button", "value": "Добавить"}));
    return e;
}

var PRODUCT_LIST_TEMPLATE =
    "{{#list}}<div class=\"product\"><img src=\"images/{{eventProductId}}s.jpg\">" +
    "<div class=\"name\">{{eventProductName}}</div><div class=\"cost\">{{eventProductPrice}} руб.</div>" +
    "<input data-key=\"{{eventProductId}}\" value=\"Добавить\" type=\"button\"></div>{{/list}}" +
    "{{#nextCount}}<div class=\"next_count\"><span>Показать еще {{nextCount}}</span></div>{{/nextCount}}";

var PRODUCT_LIST_COUNT = 25;
    

function drawProductList(first, count) {
    "use strict";
    var i, it, block, data, nextCount;
    if (first === undefined) {
        first = 0;
    }
    if (first >= PRODUCTS.length) {
        return;
    }
    nextCount = count;
    if (first + count > PRODUCTS.length) {
        count = PRODUCTS.length - first;
    }
    if (first + count + nextCount > PRODUCTS.length) {
        nextCount = PRODUCTS.length - first - count;
    }
    if (count > 0) {
        block = document.getElementById("productList");
        if (nextCount < 0) {
            nextCount = 0;
        }
        data = {"list": PRODUCTS.slice(first, first + count), "nextCount": nextCount};
        //console.log(Mustache.render(PRODUCT_LIST_TEMPLATE, data));
        if (block) {
            block.insertAdjacentHTML("beforeEnd", Mustache.render(PRODUCT_LIST_TEMPLATE, data));
        }
    }
    
}

function idToItem(id) {
    "use strict";
    var strId, i, p;
    strId = String(id);
    for (i = 0; i < PRODUCTS.length; i += 1) {
        p = PRODUCTS[i];
        if (strId === p.eventProductId) {
            return new Item(parseInt(id, 10), p.eventProductName, parseFloat(p.eventProductPrice), p.amount, "images/" + p.eventProductId + "s.jpg");
        }
    }
    return null;
}

var firstElement = 0;
function nextDraw() {
    "use strict";
    drawProductList(firstElement, PRODUCT_LIST_COUNT);
    firstElement += PRODUCT_LIST_COUNT;
}

var basketArray = new BasketArray();

function clickProductList(e) {
    "use strict";
    var p, key, item;
    p = e.target.parentElement;
    if (p instanceof HTMLElement) {
        if (p.classList.contains("next_count")) {
            p.remove();
            nextDraw();
            e.cancelBubble = true;
        }
        if (e.target.tagName === "INPUT" && p.classList.contains("product")) {
            key = e.target.getAttribute("data-key");
            if (key) {
                item = idToItem(key);
                if (item !== null) {
                    try {
                        basketArray.push(item);
                    } catch (error) {
                        if (error instanceof TooManyProductsError) {
                            alert("На складе нет столько товаров");
                        } else {
                            throw error;
                        }
                    }
                    
                }
            }
        }
    }
}

function basketEvent(e) {
    "use strict";
    var id, key, value;
    if (e.type === "change" && e.target.tagName === "INPUT" && e.target.hasAttribute("key")) {
        id = parseInt(e.target.getAttribute("key"), 10);
        value = parseInt(e.target.value, 10);
        if (isFinite(id) && id !== 0 && isFinite(value)) {
            basketArray.setCount(id, value);
        }
    }
    if (e.type === "click" && e.target.classList.contains("bsdel") && e.target.hasAttribute("key")) {
        id = parseInt(e.target.getAttribute("key"), 10);
        if (isFinite && id !== 0) {
            basketArray.removeById(id);
        }
    }
}

/*jslint vars: true*/
function main() {
    "use strict";
    
    //var test = new Item(1, "test", 15, 2);
/*    console.log(basket.summ);
    basket.addItem(test, 2);
    console.log(basket.summ);
    basket.addItem(test, 1);
    console.log(basket.summ);
    console.log(basket.countItem(test));
    basket.delItem(test, 1);
    console.log(basket.summ);*/
    //drawProductList();
    //document.body.appendChild(makeCard(test));
    var key, btest, bv, prList, bvElem;
    bvElem = document.getElementById("basket");
    bvElem.addEventListener("change", basketEvent);
    bvElem.addEventListener("click", basketEvent);
    bv = new BasketViewer(bvElem);
    
//    btest.push(new Item(1, "test", 15, 2));
//    btest.push(new Item(2, "test2", 25, 3));
//    btest.push(new Item(2, "test2", 25, 3));
    //console.log(btest._itemToBasketItem(test));
    //btest.remove(2);
    //btest.pop();
    /*console.log(btest.length);
    for (key in btest) {
        console.log(key + " = " + btest[key]);
    }*/
    //console.log(btest);
    //console.log(btest.length);
    prList = document.getElementById("productList");
    if (prList) {
        prList.addEventListener("click", clickProductList);
    }
    nextDraw();
    basketArray._change();
}
main();