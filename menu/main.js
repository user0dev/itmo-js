/*global Mustache */
/*jslint devel: true, white: true */

function main() {
    "use strict";
    var template, data;
    template = "<ul>{{#repo}}<li>{{name}}</li>{{/repo}}</ul>";
    data = {"repo": [
        {"name": "Linux"},
        {"name": "Windows"},
        {"name": "MacOS"}
    ]};
    document.body.innerHTML = Mustache.render(template, data);
}
main(); 