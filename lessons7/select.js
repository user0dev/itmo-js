function main() {
    "use strict";
    var select, option, i;
    select = document.createElement("select");
    select.multiple = true;
    for (i = 0; i < 6; i += 1) {
        option = document.createElement("option");
        option.textContent = "Пункт " + (i + 1);
        select.appendChild(option);
    }
    select.size = 5;
    document.body.appendChild(select);
}
main();