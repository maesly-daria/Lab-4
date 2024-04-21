function priority(op) {
    if (op == '+' || op == '-') {
        return 1;
    } else if (op == '*' || op == '/') {
        return 2;
    } else {
        return 0;
    }
}

function isNumeric(str) {
    return /^\d+(\.\d+)?$/.test(str); 
}

function isDigit(str) {
    return /^\d$/.test(str); 
}

function isOperation(str) {
    return /^[+\-*/]$/.test(str); 
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                    isOperation(stack[stack.length - 1]) && 
                    priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function evaluate(str) {
    let stack = [];
    let tokens = str.split(' ');
    for (token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            if (token == '+') {
                stack.push(operand1 + operand2);
            } else if (token == '-') {
                stack.push(operand1 - operand2);
            } else if (token == '*') {
                stack.push(operand1 * operand2);
            } else if (token == '/') {
                stack.push(operand1 / operand2);
            }
        }
    }
    return stack.pop();
}

function clickHandler(event) {
    let screen = document.querySelector('.screen p');
    let target = event.target;
    let value = target.textContent;

    if (screen.textContent == '0') {
        screen.textContent = '';
    }
    if (target.classList.contains('digit') ||
     target.classList.contains('operation') ||
      target.classList.contains('bracket')) {
        screen.textContent += value;
    } else if (target.classList.contains('clear')) {
        screen.textContent = '0';
    } else if (target.classList.contains('result')) {
        let result = evaluate(compile(screen.textContent));
        screen.textContent = result.toFixed(2);
    }
}

window.onload = function () {
    let calculator = document.querySelector('.buttons');
    calculator.addEventListener('click', clickHandler);
}


