function les3job4_1() {
    "use strict";
    function fun(x) {
        return 5 - x * x / 2;
    }
    var outputStr, i, min, max, step;
    min = -5;
    max = 5;
    step = 0.5;
    
    outputStr = "<table><caption>Y = 5 - X<sup>2</sup>/2</caption><tr>";
    for (i = min; i <= max; i += step) {
        outputStr += "<td>" + i + "</td>";
    }
    outputStr += "</tr><tr>";
    for (i = min; i <= max; i += step) {
        outputStr += "<td>" + fun(i) + "</td>";
    }
    outputStr += "</tr></table>";
    document.write(outputStr);
}