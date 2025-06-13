// Calculator state
let display = '0';
let previousValue = null;
let operation = null;
let waitingForOperand = false;
let isScientific = false;
let parenthesesCount = 0;
let currentExpression = '';
let history = [];
let isHistoryOpen = false;
let isMobileHistoryOpen = false;
let isDarkMode = true;
let colorPalette = 'blue';
let isMuted = false;

// Load settings from localStorage
function loadSettings() {
    const savedTheme = localStorage.getItem('calculator-theme');
    const savedPalette = localStorage.getItem('calculator-palette');
    const savedMuted = localStorage.getItem('calculator-muted') === 'true';
    
    if (savedTheme === 'light') {
        isDarkMode = false;
        document.body.classList.remove('dark');
        document.querySelector('.switch').classList.remove('active');
    } else {
        isDarkMode = true;
        document.body.classList.add('dark');
        document.querySelector('.switch').classList.add('active');
    }
    
    if (savedPalette) {
        colorPalette = savedPalette;
        document.body.className = document.body.className.replace(/theme-\w+/, '');
        if (colorPalette !== 'blue') {
            document.body.classList.add(`theme-${colorPalette}`);
        }
        document.querySelector('.palette-select').value = colorPalette;
    }
    
    isMuted = savedMuted;
    updateSoundIcon();
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('calculator-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('calculator-palette', colorPalette);
    localStorage.setItem('calculator-muted', isMuted.toString());
}

// Play click sound
function playClickSound() {
    if (!isMuted) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBzWN0+/Wdyr');
        audio.volume = 0.1;
        audio.play().catch(() => {});
    }
}

// Toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark');
        document.querySelector('.switch').classList.add('active');
    } else {
        document.body.classList.remove('dark');
        document.querySelector('.switch').classList.remove('active');
    }
    saveSettings();
}

// Change color palette
function changePalette(newPalette) {
    colorPalette = newPalette;
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    if (isDarkMode) {
        document.body.classList.add('dark');
    }
    if (newPalette !== 'blue') {
        document.body.classList.add(`theme-${newPalette}`);
    }
    saveSettings();
}

// Toggle sound
function toggleSound() {
    isMuted = !isMuted;
    updateSoundIcon();
    saveSettings();
}

function updateSoundIcon() {
    const icon = isMuted ? '🔇' : '🔊';
    document.getElementById('soundIconDesktop').textContent = icon;
    document.getElementById('soundIconMobile').textContent = icon;
}

// Toggle sidebar (desktop)
function toggleSidebar() {
    isHistoryOpen = !isHistoryOpen;
    document.getElementById('sidebar').classList.toggle('open');
}

// Toggle mobile history
function toggleMobileHistory() {
    isMobileHistoryOpen = !isMobileHistoryOpen;
    const mobileHistory = document.getElementById('mobileHistory');
    if (isMobileHistoryOpen) {
        mobileHistory.classList.remove('closed');
    } else {
        mobileHistory.classList.add('closed');
    }
}

// Set calculator mode
function setMode(mode) {
    isScientific = mode === 'scientific';
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update calculator size
    const calculator = document.getElementById('calculator');
    calculator.classList.toggle('scientific', isScientific);
    
    // Regenerate buttons
    generateButtons();
}

// Generate calculator buttons
function generateButtons() {
    const container = document.getElementById('buttonsContainer');
    container.className = `buttons ${isScientific ? 'scientific' : 'basic'}`;
    
    if (isScientific) {
        container.innerHTML = `
            <button class="btn scientific-fn" onclick="performScientificOperation('sin')">sin</button>
            <button class="btn scientific-fn" onclick="performScientificOperation('cos')">cos</button>
            <button class="btn scientific-fn" onclick="performScientificOperation('tan')">tan</button>
            <button class="btn scientific-fn" onclick="performScientificOperation('log')">log</button>
            <button class="btn scientific-fn" onclick="performScientificOperation('ln')">ln</button>
            
            <button class="btn scientific-advanced" onclick="performScientificOperation('exp')">exp</button>
            <button class="btn scientific-advanced" onclick="performScientificOperation('√')">√</button>
            <button class="btn scientific-advanced" onclick="performScientificOperation('x²')">x²</button>
            <button class="btn" onclick="inputParenthesis()">( )</button>
            <button class="btn scientific-clear" onclick="clear(event)">C</button>
            
            <button class="btn" onclick="inputNumber('7')">7</button>
            <button class="btn" onclick="inputNumber('8')">8</button>
            <button class="btn" onclick="inputNumber('9')">9</button>
            <button class="btn operator" onclick="performOperation('÷')">÷</button>
            <button class="btn operator" onclick="performOperation('×')">×</button>
            
            <button class="btn" onclick="inputNumber('4')">4</button>
            <button class="btn" onclick="inputNumber('5')">5</button>
            <button class="btn" onclick="inputNumber('6')">6</button>
            <button class="btn operator" onclick="performOperation('-')">-</button>
            <button class="btn operator" onclick="performOperation('+')">+</button>
            
            <button class="btn" onclick="inputNumber('1')">1</button>
            <button class="btn" onclick="inputNumber('2')">2</button>
            <button class="btn" onclick="inputNumber('3')">3</button>
            <button class="btn scientific-equals" onclick="handleEquals()">=</button>
            
            <button class="btn zero" onclick="inputNumber('0')">0</button>
            <button class="btn" onclick="inputDecimal()">.</button>
            <button class="btn scientific-advanced" onclick="inputPi()">π</button>
            <button class="btn scientific-advanced" onclick="inputE()">e</button>
        `;
    } else {
        container.innerHTML = `
            <button class="btn clear" onclick="clear(event)">Clear</button>
            <button class="btn operator" onclick="performOperation('÷')">÷</button>
            <button class="btn operator" onclick="performOperation('×')">×</button>
            
            <button class="btn" onclick="inputNumber('7')">7</button>
            <button class="btn" onclick="inputNumber('8')">8</button>
            <button class="btn" onclick="inputNumber('9')">9</button>
            <button class="btn operator" onclick="performOperation('-')">-</button>
            
            <button class="btn" onclick="inputNumber('4')">4</button>
            <button class="btn" onclick="inputNumber('5')">5</button>
            <button class="btn" onclick="inputNumber('6')">6</button>
            <button class="btn operator" onclick="performOperation('+')">+</button>
            
            <button class="btn" onclick="inputNumber('1')">1</button>
            <button class="btn" onclick="inputNumber('2')">2</button>
            <button class="btn" onclick="inputNumber('3')">3</button>
            <button class="btn equals" onclick="handleEquals()">=</button>
            
            <button class="btn zero" onclick="inputNumber('0')">0</button>
            <button class="btn" onclick="inputDecimal()">.</button>
        `;
    }
}

// Calculator functions
function inputNumber(num) {
    playClickSound();
    animateButton(event.target);
    
    if (waitingForOperand) {
        display = String(num);
        waitingForOperand = false;
        currentExpression = String(num);
    } else {
        display = display === '0' ? String(num) : display + num;
        currentExpression = currentExpression + num;
    }
    updateDisplay();
}

function inputDecimal() {
    playClickSound();
    animateButton(event.target);
    
    if (waitingForOperand) {
        display = '0.';
        waitingForOperand = false;
        currentExpression = '0.';
    } else if (display.indexOf('.') === -1) {
        display = display + '.';
        currentExpression = currentExpression + '.';
    }
    updateDisplay();
}

function clearAll(evt) {
    playClickSound();
    animateButton(evt.target);

    display = '0';
    previousValue = null;
    operation = null;
    waitingForOperand = false;
    parenthesesCount = 0;
    currentExpression = '';
    updateDisplay();
}


function performOperation(nextOperation) {
    playClickSound();
    animateButton(event.target);
    
    const inputValue = parseFloat(display);

    if (previousValue === null) {
        previousValue = inputValue;
        currentExpression = currentExpression + ` ${nextOperation} `;
    } else if (operation) {
        const currentValue = previousValue || 0;
        const newValue = calculate(currentValue, inputValue, operation);

        display = String(newValue);
        previousValue = newValue;
        currentExpression = currentExpression + ` ${nextOperation} `;
    }

    waitingForOperand = true;
    operation = nextOperation;
    updateDisplay();
}

function calculate(firstValue, secondValue, operation) {
    switch (operation) {
        case '+':
            return firstValue + secondValue;
        case '-':
            return firstValue - secondValue;
        case '×':
            return firstValue * secondValue;
        case '÷':
            return firstValue / secondValue;
        case '=':
            return secondValue;
        default:
            return secondValue;
    }
}

function performScientificOperation(operation) {
    playClickSound();
    animateButton(event.target);
    
    const inputValue = parseFloat(display);
    let result;

    switch (operation) {
        case 'sin':
            result = Math.sin(inputValue * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(inputValue * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(inputValue * Math.PI / 180);
            break;
        case 'log':
            result = Math.log10(inputValue);
            break;
        case 'ln':
            result = Math.log(inputValue);
            break;
        case 'exp':
            result = Math.exp(inputValue);
            break;
        case '√':
            result = Math.sqrt(inputValue);
            break;
        case 'x²':
            result = inputValue * inputValue;
            break;
        default:
            return;
    }

    const expression = `${operation}(${inputValue})`;
    addToHistory(expression, String(result));
    display = String(result);
    currentExpression = String(result);
    waitingForOperand = true;
    updateDisplay();
}

function inputParenthesis() {
    playClickSound();
    animateButton(event.target);
    
    if (display === '0' || waitingForOperand) {
        display = '(';
        currentExpression = currentExpression + '(';
        parenthesesCount++;
        waitingForOperand = false;
    } else {
        if (parenthesesCount > 0) {
            display = display + ')';
            currentExpression = currentExpression + ')';
            parenthesesCount--;
        } else {
            display = display + '(';
            currentExpression = currentExpression + '(';
            parenthesesCount++;
        }
    }
    updateDisplay();
}

function inputPi() {
    playClickSound();
    animateButton(event.target);
    
    const pi = Math.PI;
    display = String(pi);
    currentExpression = 'π';
    waitingForOperand = true;
    updateDisplay();
}

function inputE() {
    playClickSound();
    animateButton(event.target);
    
    const e = Math.E;
    display = String(e);
    currentExpression = 'e';
    waitingForOperand = true;
    updateDisplay();
}

function handleEquals() {
    playClickSound();
    animateButton(event.target);
    
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
        const newValue = calculate(previousValue, inputValue, operation);
        const expression = currentExpression || `${previousValue} ${operation} ${inputValue}`;
        
        addToHistory(expression, String(newValue));
        display = String(newValue);
        currentExpression = String(newValue);
        previousValue = null;
        operation = null;
        waitingForOperand = true;
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('displayCurrent').textContent = formatDisplay(display);
    document.getElementById('displayPrevious').textContent = 
        previousValue !== null && operation ? `${previousValue} ${operation}` : '';
}

function formatDisplay(value) {
    if (value.length > 12) {
        return parseFloat(value).toExponential(6);
    }
    return value;
}

function animateButton(button) {
    button.classList.add('animate');
    setTimeout(() => button.classList.remove('animate'), 150);
}

// History functions
function addToHistory(expression, result) {
    const newEntry = {
        id: Date.now().toString(),
        expression,
        result,
        timestamp: new Date(),
    };
    
    history = [newEntry, ...history.slice(0, 9)]; // Keep only last 10
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    const mobileHistoryList = document.getElementById('mobileHistoryList');
    
    const historyHTML = history.length === 0 ? 
        '<div class="empty-history">No calculations yet</div>' :
        history.map(entry => `
            <div class="history-item" onclick="useHistoryEntry('${entry.id}')">
                <div class="history-expression">${entry.expression}</div>
                <div class="history-result">= ${entry.result}</div>
                <div class="history-time">${entry.timestamp.toLocaleTimeString()}</div>
            </div>
        `).join('');

    historyList.innerHTML = historyHTML;
    mobileHistoryList.innerHTML = historyHTML;
}

function useHistoryEntry(id) {
    const entry = history.find(h => h.id === id);
    if (entry) {
        display = entry.result;
        currentExpression = entry.expression;
        waitingForOperand = true;
        previousValue = null;
        operation = null;
        updateDisplay();
        
        // Close mobile history
        if (window.innerWidth <= 768) {
            toggleMobileHistory();
        }
    }
}

function clearHistory() {
    history = [];
    updateHistoryDisplay();
}

// Initialize calculator
function init() {
    loadSettings();
    generateButtons();
    updateDisplay();
    updateHistoryDisplay();
}

// Start the calculator when page loads
document.addEventListener('DOMContentLoaded', init);
