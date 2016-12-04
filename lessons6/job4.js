/*jslint devel: true */

function clickToBt() {
    "use strict";
    var strList, inTextArea, outTextArea, i, s, product, digStr, p, out, r;
    inTextArea = document.getElementById("inText");
    outTextArea = document.getElementById("outText");
    strList = inTextArea.value.split("\n");
    out = "";
    for (i = 0; i < strList.length; i += 1) {
        if (!/^\s*$/.test(strList[i])) {
            s = strList[i].trim();
            product = "";
            digStr = "";
            p = s.search(/[\-–=]?\s?\d/g);
            if (p !== -1) {
                product = s.slice(0, p).trim();
                s = s.slice(p).replace(/^\s*[\-–=]*\s*/, "");
                r = s.match(/^\d+([.,]\d+)?/);
                if (r !== null) {
                    digStr = r[0].replace(",", ".");
                    s = s.slice(digStr.length).trim();
                    if (/^г|^грамм|^гр|^g|^gr|^gram/i.test(s)) {
                        digStr = String(parseFloat(digStr, 10) / 1000).replace(".", ",") + " кг.";
                    } else if (/^кило|^кг|^к|^килограмм|^kg|^kilogram|^k/i.test(s)) {
                        digStr = digStr.replace(".", ",") + " кг.";
                    } else if (/^шт|^штук|^ш/i.test(s)) {
                        digStr = digStr.replace(".", ",") + " шт.";
                    }
                }
                out += product + " (" + digStr + ")\n";
            }
        }
    }
    outTextArea.value = out;
}
//clickToBt();