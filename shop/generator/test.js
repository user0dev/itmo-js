/*global PRODUCTS*/
/*jslint devel: true */

function Item(id, name, cost, amount) {
    "use strict";
    this.eventProductId = id;
    this.eventProductName = name;
    this.eventProductPrice = cost;
    this.amount = amount;
}

function getCost() {
    "use strict";
    return Math.floor(Math.random() * 9) + 2;
}

function main() {
    "use strict";
    var text, i, prList = [], p;
    text = document.createElement("textarea");
    document.body.appendChild(text);
    text.style.width = "95%";
    text.style.height = "95%";
    text.style.position = "absolute";
    
    for (i = 0; i < PRODUCTS.length; i += 1) {
        p = PRODUCTS[i];
        prList[i] = new Item(p.eventProductId, p.eventProductName, p.eventProductPrice, getCost());
    }
    console.log(prList);
    text.value = JSON.stringify(prList, "", 4);
}
main();