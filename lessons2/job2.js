/*jslint devel: true */

function job2_2() {
    "use strict";
    function getInput() {
        return prompt("Ввведите команду", "");    
    }
    
    var input = getInput();
    mainloop:
    while (input !== null) {
        switch (input) {
            case "start": 
                alert("начало");
                break;
            case "exit": 
                alert("Выход");
                break mainloop;
            case "options":
                alert("опции");
                break;
            default:
                alert("Команда не распознана");
        }
        input = getInput(); 
    }
}