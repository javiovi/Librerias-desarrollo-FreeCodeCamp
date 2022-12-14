var $ = {
    one: function (selector) {
        return document.querySelector(selector);
    }
};

// Polyfill of ES6 Number.EPSILON
var epsilon = Number.EPSILON || 2.220446049250313e-16;

// Use object instead of variable
// When passing primitive value to function, won't change it outside
var _ref = {
    operators: {
        '=': 1,
        '*': 2,
        '/': 2,
        '+': 3,
        '-': 3
    },
    numStack: [],
    operatorStack: [],
    temp: '',
    expression: '',
    prependExpression: prependExpression
};

// Define all operators, precedence indicated by index
$.one('#wrapper').addEventListener('click', function (event) {
    var e = event || window.event;
    if (e.target.className === 'button') {
        handleClick(e.target.innerHTML, _ref);
    }
});

// Global listener for keyboard input
window.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.key !== 'Shift') {
        // TODO: Mark browser support IE >= 9 Chrome >= 51 Firefox >= 23
        handleClick(e.key, _ref);
    }
});

// function that update _this object
function handleClick(value, _this) {
    if (!isNaN(value)) {
        // Case Number
        _this.temp += value;
        updateScreen({ result: _this.temp });
    } else if (value === '.') {
        // Case .
        _this.temp = (_this.temp || 0) + '.';
        updateScreen({ result: _this.temp });
    } else if (value === 'Backspace' || value === 'C') {
        // Handle keyboard input and button click
        _this.temp = '';
        updateScreen({ result: 0 });
    } else if (value === 'Escape' || value === 'AC') {
        // Handle keyboard input and button click
        _this.numStack = [];
        _this.operatorStack = [];
        _this.temp = '';
        updateScreen({
            result: 0,
            expression: '',
            operator: ''
        });
    } else if (value === '+/-') {
        _this.temp = '-' + _this.temp;
        if (_this.temp === '-') {
            // This 0 cannot be appended to _this.temp
            updateScreen({ result: _this.temp + '0' });
        } else {
            updateScreen({ result: _this.temp });
        }
    } else if (value === 'Enter' || value === '=') {
        _this.expression = calculateAll(_this);
        // Corner case, check if temp is 0
        updateScreen({
            result: _this.temp || 0,
            expression: _this.expression,
            operator: '='
        });
    } else if (_this.operators[value]) {
        // Case + - * /
        // Handle multiple operator input that lead to extra calculation
        if (!isNaN(parseFloat(_this.temp))) {
            // Update numStack
            _this.numStack.push(+checkDot(_this.temp));
        }
        updateScreen({ operator: value });

        // Higher precedence input operator
        if (_this.operators[value] > _this.operators[_this.operatorStack[_this.operatorStack.length - 1]]) {
            var num1 = _this.numStack.pop();
            var num2 = _this.numStack.pop();
            var operator = _this.operatorStack.pop();
            var tempResult = calculate(num1, operator, num2);
            // Update current element to object
            _this.numStack.push({
                value: tempResult,
                expression: [num2, operator, num1].join(' ')
            });
            updateScreen({ result: tempResult });
        }
        _this.operatorStack.push(value);
        _this.temp = '';
    }
}

// Calculate according to current numStack and operatorStack
function calculateAll(ref) {
    // Calculate and compose initial expression
    var operator = ref.operatorStack.pop();
    var num = ref.numStack.pop();
    // Handle when the last element from stack is object
    ref.expression = [num.value || num, operator, _ref.temp].join(' ');
    ref.temp = calculate(num.value || num, operator, +ref.temp);
    // TODO: Recursion?
    while (ref.numStack.length > 0) {
        operator = ref.operatorStack.pop();
        num = ref.numStack.pop();
        // Handle when the last element from stack is object
        ref.prependExpression(num.expression || num, operator);
        ref.temp = calculate(num.value || num, operator, +ref.temp);
    }
    return ref.expression;
}

// Calculate expression
function calculate(num1, operator, num2) {
    // Calculate decimal sum of both numbers
    var precision = [num1, num2].map(function(e) {
        return ('' + e).split('.')
    }).join('').length;
    // Add extra space to handle negative num2
    var result = new Function('return ' + num1 + operator + ' ' + num2)();
    // Check if the DELTA exceeds desired epsilon
    if (Math.abs(result.toFixed(precision) - result) < epsilon) {
        // Trim trailing decimal
        return parseFloat(result.toFixed(precision));
    }
    return parseFloat(result);
}

// Prepend num and operator to existing expression
function prependExpression(num, operator) {
    this.expression = num + ' ' + operator + this.expression;
}

// Update screen node by id
function updateScreen(valueObj) {
    for (var key in valueObj) {
        $.one('#screen-' + key).innerHTML = valueObj[key];
    }
}

// Handle number w/ dot while w/o decimal
function checkDot(numStr) {
    if (/\.$/.test(numStr)) {
        return numStr + '0';
    }
    return numStr;
}