/*jslint devel: true */

function les4job4() {
    "use strict";
    var smart = {
        name: "htc 310",
        ram: 1024, //mb
        rom: 2048,
        apps: [{name: "google maps", rom: 100, ram: 10}, {name: "2gis", rom: 250, ram: 40}],
        runApps: [],
        addApp: function (pName, pRom, pRam) {
            this.apps[this.apps.length] = {name: pName, rom: pRom, ram: pRam
                                          };
        },
        start: function (n) {
            this.runApps.push(n);
        },
        getRom: function () {
            var i, r = 0;
            for (i = 0; i < this.apps.length; i += 1) {
                r += this.apps[i].rom;
            }
            return r;
        },
        getRam: function () {
            var i, r = 0;
            for (i = 0; i < this.runApps.length; i += 1) {
                r += this.apps[this.runApps[i]].ram;
            }
            return r;
        },
        myStatus: function () {
            console.log("Модель: " + this.name + "\nПостоянная память: " + this.getRom() + "/" + this.rom +
                       "\nОперативная память: " + this.getRam() + "/" + this.ram);
        }
    };
    smart.start(0);
    smart.start(1);
    smart.addApp("Мимимишки", 120, 5);
    smart.start(2);
    smart.myStatus();
}