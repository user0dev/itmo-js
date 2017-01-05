/*jslint devel: true*/

function newElement(tag, attr, text) {
    "use strict";
    if (tag === undefined) {
        return false;
    }
    
}

function relation(parent, child) {
    "use strict";
}

function getRoot(id) {
    "use strict";
}

var objDir = {
    
};

var renderSection = {
    objDir: {
    
    },
    relation: function (parent, child) {
        "use strict";
    },
    getRoot: function (id) {
        "use strict";
    },
    newElement: function (tag, attr, text) {
        "use strict";
    }
};

function deleteMessage(e) {
    "use strict";
    if (e.target.parentElement.classList.contains("message")) {
        document.getElementById("messages").removeChild(e.target.parentElement);
    }
}


function addMessage(text) {
    "use strict";
    var mes, del;
    if (text === undefined) {
        return false;
    }
    mes = document.createElement("div");
    mes.classList.add("message");
    mes.textContent = text;
    del = document.createElement("div");
    del.textContent = "X";
    mes.appendChild(del);
    document.getElementById("messages").appendChild(mes);
    return true;
}


function sendMessage(e) {
    "use strict";
    var t;
    t = document.getElementById("text");
    if (t.value.trim() !== "") {
        addMessage(t.value.trim());
    }
    
}

function main() {
    "use strict";
    document.getElementById("messages").addEventListener("click", deleteMessage);
    addMessage("Привет!\nКак у тебя дела?");
    addMessage("Hi!");
    document.getElementById("send").addEventListener("click", sendMessage);
}

main();