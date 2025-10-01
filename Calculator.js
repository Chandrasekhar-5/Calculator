const calc = document.getElementById("calc");
const btn = document.getElementById("transformBtn");
let toggled = false;

btn.addEventListener("click", () => {
  toggled = !toggled;
  calc.classList.toggle("scientific");
  calc.classList.toggle("normal");
  document.getElementById("sym1").textContent = toggled ? "+" : "√";
  document.getElementById("sym2").textContent = toggled ? "−" : "π";
  document.getElementById("sym3").textContent = toggled ? "×" : "e";
  document.getElementById("sym4").textContent = "=";
});


// ---------------- Dropdown (3 dots) ----------------
const optionsBtn = document.getElementById('optionsBtn');
const dropDown = document.getElementById('dropDown');
optionsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropDown.classList.toggle('active');
});
document.addEventListener('click', (e) => {
  if (!dropDown.contains(e.target) && !optionsBtn.contains(e.target)) {
    dropDown.classList.remove('active');
  }
});


// ---------------- Display Functions ----------------
const display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForNewInput = false;
let pendingFunction = null;
let isRadians = false;

updateAngleModeDisplay();

function clearDisplay() { 
  currentInput = '0';
  previousInput = '';
  operator = null;
  waitingForNewInput = false;
  pendingFunction = null;
  updateDisplay();
}

function updateDisplay() {

  if (operator && previousInput && !waitingForNewInput) {
    display.textContent = `${previousInput} ${operator} ${currentInput}`;
  } else if (operator && previousInput && waitingForNewInput) {
    display.textContent = `${previousInput} ${operator}`;
  } else {
  display.textContent = currentInput;
  }
}

function appendNumber(number) {

  if (pendingFunction) {
   
    if (currentInput === '0' || waitingForNewInput) {
      currentInput = number;
    } else {
      currentInput = currentInput + number;
    }
    
    
    display.textContent = `${pendingFunction}(${currentInput})`;
    display.classList.add('showing-function');
    waitingForNewInput = false;
    
  } else if (waitingForNewInput) {
    previousInput = currentInput;
    currentInput = number;
    waitingForNewInput = false;
    updateDisplay();
  } else {
    currentInput = currentInput === '0' ? number : currentInput + number;
    updateDisplay();
  }
}

function appendDecimal() {
  if (waitingForNewInput) {
    currentInput = '0.';
    waitingForNewInput = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function deleteChar() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

function handleOperator(nextOperator) {
  
  if (operator && !waitingForNewInput) {
    calculate();
  }

  if(currentInput !== '0') {
    previousInput = currentInput;
  }

  waitingForNewInput = true;
  operator = nextOperator;
  updateDisplay();
}

function calculatePendingFunction() {
  if (pendingFunction && currentInput !== '0') {
    const value = parseFloat(currentInput);
    let result = calculateScientificFunction(pendingFunction, value);
    
    display.textContent = `${pendingFunction}(${currentInput}) = ${result}`;
    currentInput = String(result);
    
    setTimeout(() => {
      display.classList.remove('showing-function');
      updateDisplay();
      pendingFunction = null;
    }, 1000);
    
    waitingForNewInput = true;
  }
}

function calculate() {
  if(pendingFunction){
    calculatePendingFunction();
    return;
  }

  if (operator === null || waitingForNewInput) return;
  
  const prevValue = parseFloat(previousInput);
  const currentValue = parseFloat(currentInput);
  let result;
  
  switch (operator) {
    case '+':
      result = prevValue + currentValue;
      break;
    case '−':
      result = prevValue - currentValue;
      break;
    case '×':
      result = prevValue * currentValue;
      break;
    case '÷':
      result = prevValue / currentValue;
      break;
    case '%':
      result = prevValue % currentValue;
      break;
    case '^':
      result = Math.pow(prevValue, currentValue);
      break;
    default:
      return;
  }
  
  currentInput = String(result);
  operator = null;
  previousInput = '';
  waitingForNewInput = true;
  updateDisplay();
}

function handleScientificFunction(func) {

  if (func === 'π' || func === 'e') {
    display.textContent = func;
    display.classList.add('showing-function');
    currentInput = func === 'π' ? Math.PI.toString() : Math.E.toString();
    setTimeout(() => {
      display.classList.remove('showing-function');
      updateDisplay();
    }, 800);
  } else {
    if(waitingForNewInput || currentInput === '0'){
      pendingFunction = func;
       display.textContent = `${func}(`;
    display.classList.add('showing-function');
    } else{
      const value = parseFloat(currentInput);
      let result = calculateScientificFunction(func, value);

    display.textContent = `${func}(${currentInput})`;
      display.classList.add('showing-function');
      currentInput = String(result);
      
      setTimeout(() => {
        display.classList.remove('showing-function');
        updateDisplay();
      }, 800);
    }
  }
  waitingForNewInput = true;
}
   
function calculateScientificFunction(func, value) {  
  switch (func) {
    case 'sin':
      return isRadians ? Math.sin(value) : Math.sin(value * Math.PI / 180);
    case 'cos':
      return isRadians ? Math.cos(value) : Math.cos(value * Math.PI / 180); 
    case 'tan':
      return isRadians ? Math.tan(value) : Math.tan(value * Math.PI / 180);
    case 'log':
      return value > 0 ? Math.log10(value) : 'Error'; 
    case 'ln':
      return value > 0 ? Math.log(value) : 'Error';
    case '√':
      return value >= 0 ? Math.sqrt(value) : 'Error';
    case '!':
      return factorial(value);
    case 'inv':
      return value !== 0 ? 1 / value : 'Error';
    default:
      return value;
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function toggleAngleMode() {
  isRadians = !isRadians;
  updateAngleModeDisplay();
}

function updateAngleModeDisplay() {
  const buttons = document.querySelectorAll('.keypad button');
  let radButton, degButton;
  
  buttons.forEach(button => {
    if (button.textContent === 'rad') radButton = button;
    if (button.textContent === 'deg') degButton = button;
  });
  
  if (radButton && degButton) {
    radButton.classList.remove('orange-mode');
    degButton.classList.remove('orange-mode');
    if (isRadians) {
      radButton.classList.add('orange-mode'); 
    } else {
      degButton.classList.add('orange-mode'); 
    }
  }
}

// Main calculator event listener
document.querySelector(".keypad").addEventListener("click", e => {
  if (e.target.tagName !== "BUTTON") return;
  const val = e.target.textContent;
  
  if (!isNaN(val) || val === '00') {
    appendNumber(val);
  } else if (val === '.') {
    appendDecimal();
  } else if (val === 'AC') {
    clearDisplay();
  } else if (val === '⌫') {
    deleteChar();
  } else if (val === '=') {
    if(pendingFunction){
      calculatePendingFunction();
    } else {
    calculate();
    }
  } else if (['+', '−', '×', '÷', '%', '^'].includes(val)) {
    handleOperator(val);
  } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', '!', 'π', 'e', 'inv'].includes(val)) {
    handleScientificFunction(val);
  } else if (val === 'rad' || val === 'deg') {
    toggleAngleMode();
  }
    else if (val === '(' || val === ')') {
      appendNumber(val);
    }
});

// ---------------- Drawer (Unit Converter) ----------------
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const rsDrawerBtn = document.querySelector(".rs-drawer");

rsDrawerBtn.addEventListener("click", () => {
  drawer.classList.add("open");
  overlay.classList.add("show");
  currentDrawer = "unit";
});
overlay.addEventListener("click", () => {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  currentDrawer = "calculator";
});


let currentDrawer = "calculator";
let currentConversionType = '';
let fromValue = '1';
let toValue = '0';

// ---------------- Converters ----------------
const converters = {
  length: ["Metre (m)", "Kilometre (km)", "Mile (mi)", "Centimetre (cm)", "Millimetre (mm)", "Yard (yd)", "Foot (ft)", "Inch (in)"],
  weight: ["Kilogram (kg)", "Gram (g)", "Pound (lb)", "Ounce (oz)", "Ton (t)", "Milligram (mg)"],
  volume: ["Litre (L)", "Millilitre (ml)", "Cubic metre (m³)", "Gallon (gal)", "Quart (qt)", "Pint (pt)", "Cup (cup)"],
  area: ["Square metre (m²)", "Square kilometre (km²)", "Hectare (ha)", "Acre (ac)", "Square mile (mi²)", "Square foot (ft²)"],
  temperature: ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)"],
  speed: ["Metre/second (m/s)", "Kilometre/hour (km/h)", "Mile/hour (mph)", "Knot (kn)"],
  pressure: ["Pascal (Pa)", "Bar", "PSI", "Atmosphere (atm)", "Torr"],
  power: ["Watt (W)", "Kilowatt (kW)", "Horsepower (hp)"],
  currency: ["USD ($)", "EUR (€)", "INR (₹)", "GBP (£)", "JPY (¥)", "CAD (C$)", "AUD (A$)"],
  numbersystem: ["Binary", "Decimal", "Hexadecimal", "Octal"]
};

// Conversion factors
const conversionFactors = {
  length: {
    "Metre (m)": 1,
    "Kilometre (km)": 0.001,
    "Mile (mi)": 0.000621371,
    "Centimetre (cm)": 100,
    "Millimetre (mm)": 1000,
    "Yard (yd)": 1.09361,
    "Foot (ft)": 3.28084,
    "Inch (in)": 39.3701
  },
  weight: {
    "Kilogram (kg)": 1,
    "Gram (g)": 1000,
    "Pound (lb)": 2.20462,
    "Ounce (oz)": 35.274,
    "Ton (t)": 0.001,
    "Milligram (mg)": 1000000
  },
  volume: {
    "Litre (L)": 1,
    "Millilitre (ml)": 1000,
    "Cubic metre (m³)": 0.001,
    "Gallon (gal)": 0.264172,
    "Quart (qt)": 1.05669,
    "Pint (pt)": 2.11338,
    "Cup (cup)": 4.22675
  },
  area: {
    "Square metre (m²)": 1,
    "Square kilometre (km²)": 0.000001,
    "Hectare (ha)": 0.0001,
    "Acre (ac)": 0.000247105,
    "Square mile (mi²)": 0.000000386102,
    "Square foot (ft²)": 10.7639
  },
  speed: {
    "Metre/second (m/s)": 1,
    "Kilometre/hour (km/h)": 3.6,
    "Mile/hour (mph)": 2.23694,
    "Knot (kn)": 1.94384
  },
  pressure: {
    "Pascal (Pa)": 1,
    "Bar": 0.00001,
    "PSI": 0.000145038,
    "Atmosphere (atm)": 0.00000986923,
    "Torr": 0.00750062
  },
  power: {
    "Watt (W)": 1,
    "Kilowatt (kW)": 0.001,
    "Horsepower (hp)": 0.00134102
  }
};

// Currency conversion rates
let currencyRates = {
  "USD ($)": 1,
  "EUR (€)": 0.85,
  "INR (₹)": 74.5,
  "GBP (£)": 0.73,
  "JPY (¥)": 110.5,
  "CAD (C$)": 1.25,
  "AUD (A$)": 1.35
};


async function fetchCurrencyRates() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    
    currencyRates["USD ($)"] = 1;
    currencyRates["EUR (€)"] = data.rates.EUR || 0.85;
    currencyRates["INR (₹)"] = data.rates.INR || 74.5;
    currencyRates["GBP (£)"] = data.rates.GBP || 0.73;
    currencyRates["JPY (¥)"] = data.rates.JPY || 110.5;
    currencyRates["CAD (C$)"] = data.rates.CAD || 1.25;
    currencyRates["AUD (A$)"] = data.rates.AUD || 1.35;
    
   
    if (currentConversionType === 'currency') {
      updateConversion();
    }
  } catch (error) {
    console.error('Failed to fetch currency rates:', error);
   
  }
}

// Convert temperature
function convertTemperature(value, fromUnit, toUnit) {
  let celsius;
  
 
  switch (fromUnit) {
    case "Celsius (°C)":
      celsius = value;
      break;
    case "Fahrenheit (°F)":
      celsius = (value - 32) * 5/9;
      break;
    case "Kelvin (K)":
      celsius = value - 273.15;
      break;
  }
  
 
  switch (toUnit) {
    case "Celsius (°C)":
      return celsius;
    case "Fahrenheit (°F)":
      return (celsius * 9/5) + 32;
    case "Kelvin (K)":
      return celsius + 273.15;
  }
}

// Convert number systems
function convertNumberSystem(value, fromBase, toBase) {
  
  const baseMap = {
    "Binary": 2,
    "Decimal": 10,
    "Hexadecimal": 16,
    "Octal": 8
  };
  
  const fromRadix = baseMap[fromBase];
  const toRadix = baseMap[toBase];
  
  
  let decimalValue;
  if (fromRadix === 10) {
    decimalValue = parseFloat(value);
  } else {
    decimalValue = parseInt(value, fromRadix);
  }
  
  
  if (toRadix === 10) {
    return decimalValue.toString();
  } else if (toRadix === 16) {
    return decimalValue.toString(16).toUpperCase();
  } else {
    return decimalValue.toString(toRadix);
  }
}

// Update conversion
function updateConversion() {
  const fromUnit = document.getElementById("from-unit").value;
  const toUnit = document.getElementById("to-unit").value;
  const value = parseFloat(fromValue) || 0;
  
  let result;
  
  if (currentConversionType === 'temperature') {
    result = convertTemperature(value, fromUnit, toUnit);
  } else if (currentConversionType === 'currency') {
    
    const usdValue = value / currencyRates[fromUnit];
    result = usdValue * currencyRates[toUnit];
  } else if (currentConversionType === 'numbersystem') {
    result = convertNumberSystem(fromValue, fromUnit, toUnit);
  } else {
    
    const fromFactor = conversionFactors[currentConversionType][fromUnit];
    const toFactor = conversionFactors[currentConversionType][toUnit];
    result = value * (toFactor / fromFactor);
  }
  
  toValue = typeof result === 'number' ? result.toFixed(6) : result;
  document.getElementById("to-value").textContent = toValue;
}


// ---------------- Open Option Drawer ----------------
function openDrawer(type) {
  const opDrawer = document.getElementById("opDrawer");
  opDrawer.classList.add("open");
  currentConversionType = type;

  
  document.getElementById("opTitle").innerText =
    type.charAt(0).toUpperCase() + type.slice(1) + " Conversion";

  
  const units = converters[type];
  const fromSelect = document.getElementById("from-unit");
  const toSelect = document.getElementById("to-unit");
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";
  units.forEach(u => {
    fromSelect.innerHTML += `<option>${u}</option>`;
    toSelect.innerHTML += `<option>${u}</option>`;
  });
  
  
  if (type === 'currency') {
    fromSelect.selectedIndex = 0; 
    toSelect.selectedIndex = 2; 
    fetchCurrencyRates(); 
  } else {
    toSelect.selectedIndex = 1;
  }

  // keypad
  const keypad = document.getElementById("key-pad");
  if (type === "numbersystem") {
    keypad.innerHTML = `
      <button class="btn">7</button>
      <button class="btn">8</button>
      <button class="btn">9</button>
      <button class="btn">A</button>
      <button class="btn">4</button>
      <button class="btn">5</button>
      <button class="btn">6</button>
      <button class="btn">B</button>
      <button class="btn">1</button>
      <button class="btn">2</button>
      <button class="btn">3</button>
      <button class="btn">C</button>
      <button class="btn spe">AC</button>
      <button class="btn">0</button>
      <button class="btn">D</button>
      <button class="btn">E</button>
      <button class="btn">F</button>
    `;
  } else {
    keypad.innerHTML = `
      <button class="btn">7</button>
      <button class="btn">8</button>
      <button class="btn">9</button>
      <button class="btn spe">AC</button>
      <button class="btn">4</button>
      <button class="btn">5</button>
      <button class="btn">6</button>
      <button class="btn">⌫</button>
      <button class="btn">1</button>
      <button class="btn">2</button>
      <button class="btn">3</button>
      <button class="empty"></button>
      <button class="btn">00</button>
      <button class="btn">0</button>
      <button class="btn">.</button>
      <button class="empty"></button>
    `;
  }

  
  fromValue = '0';
  toValue = '0';
  document.getElementById("from-value").textContent = fromValue;
  document.getElementById("to-value").textContent = toValue;
  document.getElementById("from-value").style.fontSize = "24px";
  
 
  fromSelect.addEventListener('change', updateConversion);
  toSelect.addEventListener('change', updateConversion);
  
  
  updateConversion();

  currentDrawer = "option";
}

// conversion keypad input
document.addEventListener('click', function(e) {
  if (e.target.closest('#key-pad') && e.target.classList.contains('btn')) {
    const button = e.target;
    const buttonText = button.textContent;
    const fromValueElement = document.getElementById("from-value");
    

    if (buttonText === 'AC') {
      fromValue = '0';
      pendingFunction = null;
    } else if (buttonText === '⌫') {
      fromValue = fromValue.length > 1 ? fromValue.slice(0, -1) : '0';
    } else if (buttonText === '00') {
      if (fromValue === '0') {
        fromValue = '0';
      } else {
        fromValue = fromValue + '00';
      }
    } else if (buttonText === '.') {
      if (!fromValue.includes('.')) {
        fromValue = fromValue === '0' ? '0.' : fromValue + '.';
      }
    } else {
     if (fromValue === '0') {
        fromValue = buttonText;
      } else {
        fromValue = fromValue + buttonText;
      }
    }
    
    fromValueElement.textContent = fromValue;

    if(fromValue.length > 8){
      fromValueElement.style.fontSize = "18px";
    } else if(fromValue.length > 6){
      fromValueElement.style.fontSize = "20px";
    } else {
      fromValueElement.style.fontSize = "24px";
    }
        updateConversion();
  }
  
});


// ---------------- Close Drawer (step back) ----------------
function closeDrawer() {
  if (currentDrawer === "option") {
    // back to unit converter
    document.getElementById("opDrawer").classList.remove("open");
    currentDrawer = "unit";
  } else if (currentDrawer === "unit") {
    // back to calculator
    document.getElementById("drawer").classList.remove("open");
    overlay.classList.remove("show");
    currentDrawer = "calculator";
  }
}

// Initial currency rates fetch
fetchCurrencyRates();

document.addEventListener("DOMContentLoaded", () => {
  updateAngleModeDisplay();
});