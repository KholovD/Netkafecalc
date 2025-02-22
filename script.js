// Input maydonlarini tanlab olish
const cashInput = document.getElementById('cash');
const cardInput = document.getElementById('card');
const terminalInput = document.getElementById('terminal');
const expensesInput = document.getElementById('expenses');
const debtsInput = document.getElementById('debts');

// Natija maydonlari
const cashResult = document.getElementById('cashResult');
const cardResult = document.getElementById('cardResult');
const terminalResult = document.getElementById('terminalResult');
const expensesResult = document.getElementById('expensesResult');
const debtsResult = document.getElementById('debtsResult');
const totalResult = document.getElementById('totalResult');

// Hisoblash tugmasi
const calculateButton = document.getElementById('calculateButton');

// Oddiy kalkulyator uchun JavaScript
const calcDisplay = document.getElementById('calcDisplay');
const calcButtons = document.querySelectorAll('.calc-buttons .btn');
const transferToCash = document.getElementById('transferToCash');
const transferToCard = document.getElementById('transferToCard');
const transferToTerminal = document.getElementById('transferToTerminal');
const transferToExpenses = document.getElementById('transferToExpenses');
const transferToDebts = document.getElementById('transferToDebts');
const historyList = document.getElementById('historyList');
const calcHistoryList = document.getElementById('calcHistoryList');
const clearHistory = document.getElementById('clearHistory');
const clearCalcHistory = document.getElementById('clearCalcHistory');
const exportExcel = document.getElementById('exportExcel');
const exportPDF = document.getElementById('exportPDF');
const refreshButton = document.getElementById('refreshButton');

let calcInput = '';
let calcOperator = '';
let calcFirstOperand = '';
let calcSecondOperand = '';
let history = [];
let calcHistory = [];

// Hisoblash funksiyasi
calculateButton.addEventListener('click', () => {
  updateResults();
  addToHistory();
});

// Oddiy kalkulyator funksiyalari
calcButtons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    if (value === 'C') {
      // Tozalash
      calcInput = '';
      calcOperator = '';
      calcFirstOperand = '';
      calcSecondOperand = '';
      calcDisplay.textContent = '0';
    } else if (value === 'DEL') {
      // O'chirish
      calcInput = calcInput.slice(0, -1);
      calcDisplay.textContent = calcInput || '0';
    } else if (value === '=') {
      // Hisoblash
      if (calcFirstOperand && calcOperator && calcInput) {
        calcSecondOperand = calcInput;
        const result = calculate(calcFirstOperand, calcSecondOperand, calcOperator);
        calcDisplay.textContent = result;
        calcInput = result;
        calcOperator = '';
        calcFirstOperand = '';
        calcSecondOperand = '';
        addToCalcHistory(result); // Tarixga qo'shish
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      // Operator tanlash
      if (calcInput) {
        if (calcFirstOperand && calcOperator) {
          // Avvalgi amalni hisoblash
          calcSecondOperand = calcInput;
          const result = calculate(calcFirstOperand, calcSecondOperand, calcOperator);
          calcDisplay.textContent = result;
          calcFirstOperand = result;
          calcInput = '';
        } else {
          calcFirstOperand = calcInput;
          calcInput = '';
        }
        calcOperator = value;
      }
    } else {
      // Raqam yoki nuqta kiritish
      if (value === '.' && calcInput.includes('.')) return; // Bir nechta nuqta kiritishni oldini olish
      calcInput += value;
      calcDisplay.textContent = calcInput;
    }
  });
});

// Hisoblash funksiyasi
function calculate(first, second, operator) {
  const num1 = parseFloat(first);
  const num2 = parseFloat(second);

  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num1 / num2;
    default:
      return 0;
  }
}

// Natijalarni maydonlarga qo'shish
transferToCash.addEventListener('click', () => {
  const result = parseFloat(calcDisplay.textContent) || 0;
  const currentCash = parseFloat(cashInput.value) || 0;
  cashInput.value = currentCash + result;
  updateResults();
});

transferToCard.addEventListener('click', () => {
  const result = parseFloat(calcDisplay.textContent) || 0;
  const currentCard = parseFloat(cardInput.value) || 0;
  cardInput.value = currentCard + result;
  updateResults();
});

transferToTerminal.addEventListener('click', () => {
  const result = parseFloat(calcDisplay.textContent) || 0;
  const currentTerminal = parseFloat(terminalInput.value) || 0;
  terminalInput.value = currentTerminal + result;
  updateResults();
});

transferToExpenses.addEventListener('click', () => {
  const result = parseFloat(calcDisplay.textContent) || 0;
  const currentExpenses = parseFloat(expensesInput.value) || 0;
  expensesInput.value = currentExpenses + result;
  updateResults();
});

transferToDebts.addEventListener('click', () => {
  const result = parseFloat(calcDisplay.textContent) || 0;
  const currentDebts = parseFloat(debtsInput.value) || 0;
  debtsInput.value = currentDebts + result;
  updateResults();
});

// Natijalarni yangilash funksiyasi
function updateResults() {
  // Qiymatlarni olish
  const cash = parseFloat(cashInput.value) || 0;
  const card = parseFloat(cardInput.value) || 0;
  const terminal = parseFloat(terminalInput.value) || 0;
  const expenses = parseFloat(expensesInput.value) || 0;
  const debts = parseFloat(debtsInput.value) || 0;

  // Natijalarni ko'rsatish
  cashResult.textContent = cash.toLocaleString();
  cardResult.textContent = card.toLocaleString();
  terminalResult.textContent = terminal.toLocaleString();
  expensesResult.textContent = expenses.toLocaleString();
  debtsResult.textContent = debts.toLocaleString();

  // Umumiy summani hisoblash (hammasini qo'shish)
  const total = cash + card + terminal + expenses + debts;
  totalResult.textContent = total.toLocaleString();
}

// Tarixga qo'shish
function addToHistory() {
  const cash = parseFloat(cashInput.value) || 0;
  const card = parseFloat(cardInput.value) || 0;
  const terminal = parseFloat(terminalInput.value) || 0;
  const expenses = parseFloat(expensesInput.value) || 0;
  const debts = parseFloat(debtsInput.value) || 0;
  const total = cash + card + terminal + expenses + debts;

  const entry = {
    date: new Date().toLocaleString(),
    cash,
    card,
    terminal,
    expenses,
    debts,
    total
  };

  history.push(entry);
  renderHistory();
  saveToGoogleSheets(entry); // Google Sheets-ga yozish
}

// Google Sheets-ga ma'lumot yozish
function saveToGoogleSheets(entry) {
  const url = "https://script.google.com/macros/s/AKfycbyZ7nmJpMc3xQZvfsx6Va-lgXxF6smJ1sXsxepPgUVC8kl4IYUYm8TczcPihSWguCk/exec"; // Apps Script Web App URL
  const data = {
    date: entry.date,
    cash: entry.cash,
    card: entry.card,
    terminal: entry.terminal,
    expenses: entry.expenses,
    debts: entry.debts,
    total: entry.total
  };

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.error('Xatolik:', error));
}

// Oddiy kalkulyator tarixiga qo'shish
function addToCalcHistory(result) {
  const entry = {
    date: new Date().toLocaleString(),
    result
  };

  calcHistory.push(entry);
  renderCalcHistory();
}

// Tarixni ko'rsatish
function renderHistory() {
  historyList.innerHTML = '';
  history.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${entry.date}: Naqd Pul - ${entry.cash}, Karta - ${entry.card}, Terminal - ${entry.terminal}, Rasxot - ${entry.expenses}, Qarzlar - ${entry.debts}, Umumiy - ${entry.total}`;
    historyList.appendChild(li);
  });
}

// Oddiy kalkulyator tarixini ko'rsatish
function renderCalcHistory() {
  calcHistoryList.innerHTML = '';
  calcHistory.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${entry.date}: ${entry.result}`;
    calcHistoryList.appendChild(li);
  });
}

// Tarixni tozalash
clearHistory.addEventListener('click', () => {
  history = [];
  renderHistory();
});

clearCalcHistory.addEventListener('click', () => {
  calcHistory = [];
  renderCalcHistory();
});

// Excelga yuklash
exportExcel.addEventListener('click', () => {
  const data = [
    ["Sana", "Naqd Pul", "Karta", "Terminal", "Rasxot", "Qarzlar", "Umumiy Summa"],
    ...history.map(entry => [
      entry.date,
      entry.cash,
      entry.card,
      entry.terminal,
      entry.expenses,
      entry.debts,
      entry.total
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tarix");
  XLSX.writeFile(wb, "kalkulyator_tarixi.xlsx");
});

// PDFga yuklash (jadval ko'rinishida)
exportPDF.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape', // Gorizontal holat
    unit: 'mm',
    format: [3276, 58] // 58(48) x 3276 mm
  });

  // autoTable plugin-ni ishga tushirish
  doc.autoTable({
    head: [["Sana", "Naqd Pul", "Karta", "Terminal", "Rasxot", "Qarzlar", "Umumiy Summa"]],
    body: history.map(entry => [
      entry.date,
      entry.cash,
      entry.card,
      entry.terminal,
      entry.expenses,
      entry.debts,
      entry.total
    ]),
    startY: 20,
    margin: { top: 20 },
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185] }, // Jadval bosh qismi rangi
    bodyStyles: { fillColor: [236, 240, 241] } // Jadval tana qismi rangi
  });

  // PDFni yuklab olish
  doc.save("kalkulyator_tarixi.pdf");
});

// Yangilash tugmasi
refreshButton.addEventListener('click', () => {
  cashInput.value = '';
  cardInput.value = '';
  terminalInput.value = '';
  expensesInput.value = '';
  debtsInput.value = '';
  updateResults();
});