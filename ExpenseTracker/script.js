// ===============================
// SELECT DOM ELEMENTS
// ===============================
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

// ===============================
// LOAD DATA FROM LOCAL STORAGE
// ===============================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// EVENT LISTENER (FORM SUBMIT)
// ===============================
transactionFormEl.addEventListener("submit", addTransaction);

// ===============================
// ADD NEW TRANSACTION
// ===============================
function addTransaction(e) {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  // Validation
  if (description === "" || isNaN(amount)) {
    alert("Please enter valid description and amount");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description: description,
    amount: amount,
  };

  // Add to array
  transactions.push(newTransaction);

  // Save + Update UI
  saveToLocalStorage();
  updateUI();

  // Reset form
  transactionFormEl.reset();
}

// ===============================
// UPDATE FULL UI
// ===============================
function updateUI() {
  updateTransactionList();
  updateSummary();
}

// ===============================
// RENDER TRANSACTION LIST
// ===============================
function updateTransactionList() {
  transactionListEl.innerHTML = "";

  // Latest transactions on top
  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const li = document.createElement("li");

    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>
        ${formatCurrency(transaction.amount)}
        <button class="delete-btn" data-id="${transaction.id}">✖</button>
      </span>
    `;

    // Delete button event
    li.querySelector(".delete-btn").addEventListener("click", () => {
      removeTransaction(transaction.id);
    });

    transactionListEl.appendChild(li);
  });
}

// ===============================
// UPDATE BALANCE SUMMARY
// ===============================
function updateSummary() {
  const amounts = transactions.map((t) => t.amount);

  const balance = amounts.reduce((acc, val) => acc + val, 0);

  const income = amounts
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val, 0);

  const expenses = amounts
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val, 0);

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

// ===============================
// FORMAT CURRENCY (₹ INR)
// ===============================
function formatCurrency(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
}

// ===============================
// DELETE TRANSACTION
// ===============================
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);

  saveToLocalStorage();
  updateUI();
}

// ===============================
// SAVE DATA TO LOCAL STORAGE
// ===============================
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ===============================
// INITIAL LOAD
// ===============================
updateUI();