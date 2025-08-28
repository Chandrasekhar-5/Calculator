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
function clearDisplay() { display.textContent = '0'; }
function append(value) {
  if (display.textContent === '0') display.textContent = value;
  else display.textContent += value;
}
function deleteChar() {
  display.textContent = display.textContent.slice(0, -1);
  if (display.textContent === '') display.textContent = '0';
}
function calculate() {
  try {
    display.textContent = eval(display.textContent.replace('÷','/').replace('×','*'));
  } catch { display.textContent = 'Error'; }
}
document.querySelector(".keypad").addEventListener("click", e => {
  if(e.target.tagName !== "BUTTON") return;
  const val = e.target.textContent;
  if(val === "AC") clearDisplay();
  else if(val === "⌫") deleteChar();
  else if(val === "=") calculate();
  else append(val);
});

// ---------------- Drawer (Unit Converter) ----------------
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const rsDrawerBtn = document.querySelector(".rs-drawer");

rsDrawerBtn.addEventListener("click", () => {
  drawer.classList.add("open");
  overlay.classList.add("show");
  currentDrawer = "unit"; // mark state
});
overlay.addEventListener("click", () => {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  currentDrawer = "calculator";
});

// ---------------- State Handling ----------------
let currentDrawer = "calculator"; 
// can be "calculator", "unit", "option"

// ---------------- Converters ----------------
const converters = {
  length: ["Metre (m)", "Kilometre (km)", "Mile (mi)", "Centimetre (cm)"],
  weight: ["Kilogram (kg)", "Gram (g)", "Ton (t)", "Milligram (mg)"],
  volume: ["Litre (L)", "Millilitre (ml)", "Cubic metre (m³)", "Gallon (gal)"],
  area: ["Square metre (m²)", "Square kilometre (km²)", "Hectare (ha)"],
  temperature: ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)"],
  speed: ["m/s", "km/h", "mph"],
  pressure: ["Pascal (Pa)", "Bar", "PSI"],
  power: ["Watt (W)", "Kilowatt (kW)", "Horsepower (hp)"],
  currency: ["USD ($)", "EUR (€)", "INR (₹)"],
  numbersystem: ["Binary", "Decimal", "Hexadecimal"]
};

// ---------------- Open Option Drawer ----------------
function openDrawer(type) {
  const opDrawer = document.getElementById("opDrawer");
  opDrawer.classList.add("open");

  // title
  document.getElementById("opTitle").innerText =
    type.charAt(0).toUpperCase() + type.slice(1) + " Conversion";

  // dropdowns
  const units = converters[type];
  const fromSelect = document.getElementById("from-unit");
  const toSelect = document.getElementById("to-unit");
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";
  units.forEach(u => {
    fromSelect.innerHTML += `<option>${u}</option>`;
    toSelect.innerHTML += `<option>${u}</option>`;
  });
  toSelect.selectedIndex = 1;

  // keypad
  const keypad = document.getElementById("key-pad"); // FIXED id
  if (type === "numbersystem") {
    keypad.innerHTML = `
      <button class="btn">A</button><button class="btn">B</button><button class="btn">C</button>
      <button class="btn">D</button><button class="btn">E</button><button class="btn">F</button>
      <button class="btn">0</button><button class="btn">1</button>
      <button class="btn">AC</button><button class="btn">&larr;</button>
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
      <button class="btn ">⌫</button>
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

  currentDrawer = "option";
}

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