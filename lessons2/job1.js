function reverseString(str) {
    var onlyStr = "" + str;
    var result = "";
    var i = onlyStr.length-1;
    while( i >= 0 ) {
        result += onlyStr[i];
        i--;
    }
    return result;
}


function job1_1() {
    while(true) {
        var input = prompt("Введите строку", "");
        if(input == null)
            break;
        alert(reverseString(input));
    }
}

function job1_2() {
    var input = prompt("Введите целое число", "");
    while(input != null) {
        if(!isIntNumber(input)) {
            input = prompt("Неверный ввод! Введите целое число", "");
            continue;
        }
        var n = +input;
        var r = parseInt(reverseString(n.toString(3)), 3);
        alert(r);
        input = promt("Введите целое число", "");
    }
}

function job1_3() {
    var input = prompt("Введите целое не отрицательное число", "");
    while(input != null) {
        if(!isIntNumber(input)||input<0) {
            input = prompt("Неверный ввод! Введите целое неотрицательное число", "");
            continue;
        }
        var sum = 0;
        var num = 1;
        while(input >= num) {
            sum+=num;
            num++;
        }
        alert("Сумма чисел от 1 до "+input+" равна "+sum);
        input = prompt("Введите целое не отрицательное число", "");
    }
}