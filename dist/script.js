// const addExpenseBtn = document.getElementById("add-expense-btn");
// const cardContainer = document.getElementById("card-container");
// const form = document.getElementById("expense-form");
const expenses = [];
const request = indexedDB.open("ExpenseDB", 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("expenses", { keyPath: "id" });
};
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
    console.log(`Added : Expense Name: ${name}, Category: ${category}, Amount: ${amount}`);
    console.log("Current Expenses:", expenses);
    return false; // ❗ prevents page refresh
}
// addExpenseBtn?.addEventListener("click", () => { cardContainer?.classList.toggle('show'); });
//# sourceMappingURL=script.js.map