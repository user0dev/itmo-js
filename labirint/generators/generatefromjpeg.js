/*jslint devel: true */

function main() {
    "use strict";
    var canvas, textOut, ctx, img, imageData, i, j, outStr, lineStr;
    textOut = document.getElementById("output");
    canvas = document.getElementById("canv");
    canvas.style.border = "1px solid black";
    ctx = canvas.getContext("2d");
    img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(1, 1, img.width - 2, img.height - 2);
        outStr = "textMap = [\n";
        for (i = imageData.width * 4 * 4; i < imageData.data.length; i += imageData.width * 4 * 8) {
            lineStr = "\"";
            for (j = 4 * 4; j < imageData.width * 4; j += 8 * 4) {
                if (imageData.data[i + j] >= 128) {
                    lineStr += " ";
                } else {
                    lineStr += "*";
                }
            }
            if (i + 1 !== imageData.height) {
                lineStr += "\",\n";
            } else {
                lineStr += "\"\n";
            }
            outStr += lineStr;
            
        }
        outStr += "];\n";
        textOut.value = outStr;
    };
    img.src = "../images/labirint.jpg";
}
main();