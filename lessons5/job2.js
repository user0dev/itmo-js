/*jslint devel: true */

function Smartphone(name, ram, rom, apps) {
    "use strict";
    if (!Array.isArray(apps)) {
        apps = [];
    }
    var runApps = [], getIndexApp, cardSize = 0;

    getIndexApp = function (name) {
        var i;
        for (i = 0; i < apps.length; i += 1) {
            if (apps[i].name === name) {
                return i;
            }
        }
        return -1;
    };
    this.isRunning = function (name) {
        var i;
        for (i = 0; i < runApps.length; i += 1) {
            if (runApps[i] === name) {
                return true;
            }
        }
        return false;
    };
    this.isInstallApp = function (name) {
        var i;
        for (i = 0; i < apps.length; i += 1) {
            if (name === apps[i]) {
                return true;
            }
        }
        return false;
    };

    this.addApp = function (pName, pRom, pRam, pCard) {
        if (pCard && cardSize === 0) {
            console.log("Отсутсвтвует карта памяти");
            return false;
        }
        if (pCard === true) {
            if (cardSize < pRom + this.getCard()) {
                console.log("Не хватает места на карте памяти");
                return false;
            }
        } else if (rom < pRom + this.getRom()) {
            console.log("Не хватает места в памяти телефона");
            return false;
        }
        if (pCard === undefined) {
            pCard = false;
        }
        if (!this.isInstallApp(pName)) {
            apps.push({name: pName, rom: pRom, ram: pRam, card: pCard});
            console.log("Приложение " + pName + " успешно установлено");
            return true;
        }
        console.log("Приложение уже установлено");
        return false;
    };
    this.start = function (name) {
        if (!this.isRunning(name)) {
            if (apps[getIndexApp(name)].ram + this.getRam > ram) {
                console.log("Оперативная память заполнена");
                return true;
            }
            runApps.push(name);
            return true;
        }
        console.log("Приложение уже запущено");
        return false;
    };
    this.getRom = function () {
        var i, r = 0;
        for (i = 0; i < apps.length; i += 1) {
            if (apps[i].card !== true) {
                r += apps[i].rom;
            }
        }
        return r;
    };
    this.getCard = function () {
        if (cardSize === 0) {
            console.log("Карта памяти отсутствует");
            return 0;
        }
        var i, r = 0;
        for (i = 0; i < apps.length; i += 1) {
            if (apps[i].card === true) {
                r += apps[i].rom;
            }
        }
        return r;
    };
    this.getRam = function () {
        var i, r = 0, ind;
        for (i = 0; i < runApps.length; i += 1) {
            ind = getIndexApp(runApps[i]);
            if (ind !== -1) {
                r += apps[ind].ram;
            }
        }
        return r;
    };
    this.myStatus = function () {
        var cardStr = "\nКарта памяти не установлена";
        if (cardSize !== 0) {
            cardStr = "\nКарта памяти: " + this.getCard() + "/" + cardSize;
        }
        console.log("Модель: " + name + "\nПостоянная память: " + this.getRom() + "/" + rom +
                   "\nОперативная память: " + this.getRam() + "/" + ram + cardStr);
    };
    this.setupCard = function (size) {
        if (size <= 0) {
            console.log("Не верный парамерт");
            return false;
        }
        if (cardSize === 0) {
            cardSize = size;
            console.log("Карта памяти установлена");
            return true;
        }
        console.log("Карта памяти уже установлена");
        return false;
    };
    this.removeCard = function () {
        var i, j;
        if (cardSize !== 0) {
            cardSize = 0;
            for (i = 0; i < runApps.length; i += 1) {
                j = getIndexApp(runApps[i]);
                if (j !== -1 && apps[j].card === true) {
                    runApps.splice(i, 1);
                    i -= 1;
                }
            }
            for (i = 0; i < apps.length; i += 1) {
                if (apps[i].card === true) {
                    apps.splice(i, 1);
                    i -= 1;
                }
            }
            console.log("Карта успешно извлечена");
            return true;
        }
        console.log("Карта памяти отсутствует");
        return false;
    };
    this.moveToCard = function (name) {
        if (cardSize === 0) {
            console.log("Карта памяти отсутствует");
            return false;
        }
        var ind = getIndexApp(name);
        if (ind === -1) {
            console.log("Приложение не найдено");
            return false;
        }
        if (apps[ind].card === true) {
            console.log("Приложение уже на карте памяти");
            return false;
        }
        if (apps[ind].rom + this.getCard() > cardSize) {
            console.log("Не достаточно памяти на устройстве");
            return false;
        }
        apps[ind].card = true;
        console.log("Приложение " + name + " успешно перемещено на карту памяти");
        return true;
    };
    this.moveToRom = function (name) {
        if (cardSize === 0) {
            console.log("Карта памяти отсутствует");
            return false;
        }
        var ind = getIndexApp(name);
        if (ind === -1) {
            console.log("Приложение не найдено");
            return false;
        }
        if (apps[ind].card !== true) {
            console.log("Приложение уже в памяти телефона");
            return false;
        }
        if (apps[ind].rom + this.getRom() > rom) {
            console.log("Не достаточно памяти на устройстве");
            return false;
        }
        apps[ind].card = false;
        console.log("Приложение " + name + " успешно перемещено в память телефона");
        return true;
    };
}


function les5job2() {
    "use strict";
    var htc310 = new Smartphone("htc 310", 1024, 2040,
                                [{name: "google maps", rom: 100, ram: 10},
                                 {name: "2gis", rom: 250, ram: 40}]);
    htc310.start("google maps");
    htc310.start("2gis");
    htc310.myStatus();
    htc310.addApp("Мимимишки", 120, 5);
    htc310.start("Мимимишки");
    htc310.setupCard(4000);
    htc310.addApp("Вселая ферма", 2500, 100, true);
    htc310.myStatus();
    htc310.addApp("GTA", 2000, 200, true);
    htc310.moveToCard("2gis");
    htc310.myStatus();
    htc310.removeCard();
    htc310.myStatus();
}