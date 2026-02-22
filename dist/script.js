// const addExpenseBtn = document.getElementById("add-expense-btn");
// const cardContainer = document.getElementById("card-container");
// const form = document.getElementById("expense-form");
const expenses = [];
let db;
const request = indexedDB.open("ExpenseDB", 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("expenses", { keyPath: "id" });
};
request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database ready");
    // Load expenses automatically on page load
    getAllExpenses();
};
function getAllExpenses() {
    const transaction = db.transaction("expenses", "readonly");
    const store = transaction.objectStore("expenses");
    const request = store.getAll();
    request.onsuccess = function () {
        const expenses = request.result;
        console.log("All expenses:", expenses);
        renderExpenses(expenses);
    };
    request.onerror = function () {
        console.log("Error fetching expenses");
    };
}
function renderExpenses(expenses) {
    const container = document.getElementById("expenses-container");
    if (!container)
        return;
    container.innerHTML = "";
    expenses.forEach(expense => {
        const row = document.createElement("div");
        row.classList.add("expenses-grid", "expense-row");
        row.innerHTML = `
            <div>${expense.name}</div>
            <div>${expense.category}</div>
            <div>₹${expense.amount}</div>
            <div>${expense.date}</div>
        `;
        container.appendChild(row);
    });
}
function saveExpense(expense) {
    const db = request.result;
    const transaction = db.transaction("expenses", "readwrite");
    const store = transaction.objectStore("expenses");
    store.add(expense);
    transaction.oncomplete = () => {
        console.log("Expense saved to IndexedDB");
    };
}
function addExpenseToDatabase() {
    const nameElement = document.getElementById("expense-name");
    const name = nameElement?.value || "";
    const categoryElement = document.getElementById("category-select");
    const category = categoryElement?.value || "";
    const amountElement = document.getElementById("expense-amount");
    const amount = amountElement ? parseFloat(amountElement.value) : 0;
    const expense = {
        id: Date.now(),
        name: name,
        category: category,
        amount: Number(amount),
        date: new Date().toISOString().split("T")[0]
    };
    expenses.push(expense);
    saveExpense(expense);
    window.location.reload();
    console.log(`Added : Expense Name: ${name}, Category: ${category}, Amount: ${amount}`);
    console.log("Current Expenses:", expenses);
    return false; // ❗ prevents page refresh
}
// addExpenseBtn?.addEventListener("click", () => { cardContainer?.classList.toggle('show'); });
//# sourceMappingURL=script.js.map