
function job3() {
    "use strict";

    function isNumber(str) {
        return str.trim() !== "" && isFinite(str);
    }
    function isIntNumber(str) {
        return isNumber(str) && (+str === Math.round(str));
    }
    function getInput(error) {
        var errorStr = error ? "Ошибка! Не верный ввод. " : "";
        return prompt(errorStr + "Введите числа \"Начальное\" \"Конечное\" \"Число колонок\" через пробел", "0 1010 9");
    }
    function getTabs(num, maxSymb) {
        var spaces = 4; // количество пробелов в табуляции
        var symb = num.toString().length;
        var maxSymbInCell = spaces;
        while(maxSymbInCell < maxSymb+1)
            maxSymbInCell+=spaces;
        var result = "";
        for(var i = symb+1; i <= maxSymbInCell; i+=spaces)
            result+="\t";
        return result;
    }
    var input = getInput();
    mainloop:
    while (input !== null) {
        var inputList = input.trim().split(" ");
        if (inputList.length !== 3) {
            input = getInput(true);
            continue;
        }
        for (var i = 0; i < inputList.length; i++) {
            if (!isIntNumber(inputList[i])) {
                input =  getInput(true);
                continue mainloop;
            }
        }
        var startNum = +inputList[0];
        var endNum = +inputList[1];
        var cols = +inputList[2];
        if (cols <= 0) {
            alert("Число колонок должно быть больше нуля")
            getInput(error);
            continue;
        }
        var countNum = Math.abs(Math.max(startNum, endNum) - Math.min(startNum, endNum))+1;
        var countSymb = Math.max(startNum.toString().length, endNum.toString().length); //сколько символов занимает самое длинное число
        

        var outNum = startNum; 
        var outStr = ""; //выводимая строка
        for(i = 1; i <= countNum; i+=cols) { //цикл формирует выводимую строку. 
            var outRow = ""; //Строка из символов. Потом добавится к результирующей строке + символ переноса
            var countOutNum = Math.min(cols, countNum-i+1) //определение сколько символов в строке так как их может быть не кратно колличеству колонок
            for(var n = 1; n <= countOutNum; n++) { //Формирование строки из символов
                outRow+=outNum;
                if (n<countOutNum) //в конце табуляцию не добавлять
                    outRow+=getTabs(outNum, countSymb);
                if (startNum < endNum)
                    outNum++;
                else
                    outNum--;
            }
            outStr += outRow;
            if(i+cols <= countNum) //добавить пробел если не последняя строка.  
                outStr+="\n";
            
        }
        alert(outStr);
        input = getInput();
    }
}