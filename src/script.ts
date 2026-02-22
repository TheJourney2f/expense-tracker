const expenses: {id: number, name: string, category: string, amount: number, date: string}[] = [];

let db: IDBDatabase;
const request = indexedDB.open("ExpenseDB", 1);
request.onupgradeneeded = function (event: any) {
    db = event.target.result;
    db.createObjectStore("expenses", { keyPath: "id" });
};

request.onsuccess = function (event: any) {
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

function renderExpenses(expenses: any[]) {

    const container = document.getElementById("expenses-container");
    if (!container) return;

    container.innerHTML = "";

    expenses.forEach(expense => {

        const row = document.createElement("div");
        row.classList.add("expenses-grid", "expense-row");

        row.innerHTML = `
            <div>${expense.name}</div>
            <div>${expense.category}</div>
            <div>₹${expense.amount}</div>
            <div>${expense.date}</div>
            <div>
                <button class="delete-btn" data-id="${expense.id}">
                    Delete
                </button>
            </div>
        `;

        container.appendChild(row);
    });

    attachDeleteEvents();
}

function attachDeleteEvents() {
    const buttons = document.querySelectorAll(".delete-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number((button as HTMLElement).getAttribute("data-id"));
            deleteExpense(id);
            getAllExpenses(); // refresh UI
        });
    });
}

function deleteExpense(id: number) {
    const transaction = db.transaction("expenses", "readwrite");
    const store = transaction.objectStore("expenses");

    const request = store.delete(id);

    request.onsuccess = () => {
        console.log("Deleted:", id);
    };
}

function saveExpenseToDatabase(expense: any) {
    const db = request.result;
    const transaction = db.transaction("expenses", "readwrite");
    const store = transaction.objectStore("expenses");

    store.add(expense);

    transaction.oncomplete = () => {
        console.log("Expense saved to IndexedDB");
    };
}

function calculateTotalAmount() {
    const transaction = db.transaction("expenses", "readonly");
    const store = transaction.objectStore("expenses");
    const request = store.getAll();

    request.onsuccess = function () {
        const expenses = request.result;
        let total = 0;
        expenses.forEach((expense: any) => {
            total += expense.amount;
        });
        const totalAmountElement = document.getElementById("total-amount");
        if (totalAmountElement) {
            totalAmountElement.textContent = `Total : ₹${total}`;
        }
    };
}

function addExpenseToDatabase() {

    const nameElement = document.getElementById("expense-name") as HTMLInputElement | null; const name = nameElement?.value || "";
    const categoryElement = document.getElementById("category-select") as HTMLSelectElement | null; const category = categoryElement?.value || "";
    const amountElement = document.getElementById("expense-amount") as HTMLInputElement | null; const amount = amountElement ? parseFloat(amountElement.value) : 0;

    const expense = {
        id: Date.now(),
        name: name,
        category: category,
        amount: Number(amount),
        date: new Date().toISOString().split("T")[0]!
    };
    expenses.push(expense);
    saveExpenseToDatabase(expense);
    window.location.reload();
    console.log(`Added : Expense Name: ${name}, Category: ${category}, Amount: ${amount}`);
    console.log("Current Expenses:", expenses);
    return false; // ❗ prevents page refresh
}