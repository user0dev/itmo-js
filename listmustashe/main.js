/*global Mustache, PRODUCTS */
/*jslint devel: true, white: true */

function main() {
    "use strict";
    var template, data;
    template = '<div id="productList">{{#repo}}' +
                    '<div class="product">' +
                        '<img src="images/{{eventProductId}}s.jpg">' +
                        '<div class="name">{{eventProductName}}</div>' +
                        '<div class="cost">{{eventProductPrice}} руб.</div>' +
                        '<input type="button" value="Добавить">' +
                    '</div>' +
                '{{/repo}}</div>';
    document.body.innerHTML = Mustache.render(template, PRODUCTS);
}
main(); 