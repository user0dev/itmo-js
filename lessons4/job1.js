/*jslint devel: true */

var warrior = {
    name: "Иван",
    surname: "Иванов",
    patronymic: "Иванович",
    backpack: [
        {name: "удочка", weight: 0.5},
        {name: "леска", weight: 0.01},
        {name: "наживка", weight: 0.02},
        {name: "крючек", weight: 0.001},
        {name: "крючек", weight: 0.001},
        {name: "грузило", weight: 0.03}
    ],
    getDouble: function (name) {
        "use strict";
        var result = [], i, n;
        n = name.toLowerCase();
        for (i = 0; i < this.backpack.length; i += 1) {
            if (this.backpack[i].name.toLowerCase() === n) {
                result.push(this.backpack[i]);
            }
        }
        return result;
    },
    getWeight: function (name) {
        "use strict";
        var i, weight = 0, n, arr;
        n = name.toLowerCase();
        arr = this.getDouble(name);
        for (i = 0; i < arr.length; i += 1) {
            weight += arr[i].weight;
        }
        return weight;
    },
    getCount: function (name) {
        "use strict";
        var r;
        r = this.getDouble(name).length;
        return r;
    },
    putToBackpack: function (pName, pWeight) {
        "use strict";
        this.backpack.push({name: pName, weight: pWeight});
    },
    dropFromBackpack: function (name, deleteOnce) {
        "use strict";
        var i, success;
        success = false;
        for (i = 0; i < this.backpack.length; i += 1) {
            if (this.backpack[i].name.toLowerCase() === name.toLowerCase()) {
                this.backpack.splice(i, 1);
                if (deleteOnce === true) {
                    return true;
                }
                success = true;
            }
        }
        return success;
    },
    toString: function () {
        "use strict";
        var i, res;
        res = this.surname + " " + this.name + " " + this.patronymic + "\nВ рюкзаке: ";
        for (i = 0; i < this.backpack.length; i += 1) {
            res += this.backpack[i].name + " - " + this.backpack[i].weight;
            if (i + 1 < this.backpack.length) {
                res += ", ";
            }
        }
        
        return res;
    }
};

function les4job1() {
    "use strict";
    alert(warrior);
    alert("Добавить крючек");
    warrior.putToBackpack("крючек", 0.01);
    alert(warrior);
    alert("Вес всех крючков: " + warrior.getWeight("крючек"));
    alert("Колличество крючков: " + warrior.getCount("крючек"));
    alert("Выкинуть все крючки");
    warrior.dropFromBackpack("крючек");
    alert(warrior);
}