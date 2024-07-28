const CATEGORIES_KEY = "Categories";
const EXPENSES_KEY = "Exp";
const APPEARANCE_KEY = "Appearance";
const CURRENCIES_KEY = "Currencies";

// Selectors
const CATEGORIES_SELECTOR = "categories-container";
const MODAL_SELECTOR = "modal-overlay";
const EXPENSES_SELECTOR = "table-container";


function toggleAppearance(){
    if(document.documentElement.getAttribute("data-theme") === "dark"){
        document.documentElement.setAttribute("data-theme","light");
        saveData(APPEARANCE_KEY, "light");
    } else {
        document.documentElement.setAttribute("data-theme","dark");
        saveData(APPEARANCE_KEY, "dark");
    }
    return;
}

function setAppearance(value){
    document.documentElement.setAttribute("data-theme",value);
}

function handleAppearance(){
    // Handle toggle click
    document.getElementById("appearanceToggle").addEventListener("click", () => toggleAppearance());

    // Check if user has set a preference
    document.documentElement.getAttribute("data-theme") === "dark" ? document.documentElement.setAttribute("data-theme","dark") : document.documentElement.setAttribute("data-theme","light");
    const appearance = getData(APPEARANCE_KEY);
    if(appearance === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setAppearance("dark");
        return;
    } else if(appearance === "light" || appearance === "dark"){
        setAppearance(appearance);
        return;
    }
}

function onEditCategory(category){
    const modal = domAPI.generateEditCategoryModal(category);
    const modalOverlay = document.getElementById(MODAL_SELECTOR);
    modalOverlay.innerHTML = "";
    modalOverlay.appendChild(modal);
    modalOverlay.classList.add("show");

    const form = modal.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const categoryName = formData.get("name");
        const color = formData.get("color");
        const newCategory = {name: categoryName, color: color};
        categoriesAPI.updateCategory(category, newCategory);
        modalOverlay.classList.remove("show");
        renderCategories();
    });
}

function onAddCategory(){
    const modal = domAPI.generateAddCategoryModal();
    const modalOverlay = document.getElementById(MODAL_SELECTOR);
    modalOverlay.innerHTML = "";
    modalOverlay.appendChild(modal);
    modalOverlay.classList.add("show");

    const form = modal.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const categoryName = formData.get("name");
        const color = formData.get("color");
        const category = {name: categoryName, color: color};
        categoriesAPI.addCategory(category);
        modalOverlay.classList.remove("show");
        renderCategories();
    });
}

function onCloseModal(){
    const modalOverlay = document.getElementById(MODAL_SELECTOR);
    modalOverlay.classList.remove("show");
}

function onDeleteCategory(category){
    categoriesAPI.deleteCategory(category);
    renderCategories();
}

function renderCategories(){
    const categories = categoriesAPI.getCategories();
    const categoriesList = document.getElementById(CATEGORIES_SELECTOR);
    if(categoriesList){
        categoriesList.innerHTML = "";
        categoriesList.appendChild(domAPI.generateCategoriesList(categories));
    }
}

async function onAddExpense(){
    try {
        const modal = await domAPI.generateAddExpenseModal();
        const modalOverlay = document.getElementById(MODAL_SELECTOR);
        if (modalOverlay) {
            modalOverlay.innerHTML = "";
            modalOverlay.appendChild(modal);
            modalOverlay.classList.add("show");
        }

        const form = modal.querySelector("form");
        console.log(form);
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const expense = {
                    name: formData.get("name"),
                    amount: formData.get("amount"),
                    currency: formData.get("currency"),
                    category: formData.get("category"),
                    date: formData.get("date"),
                    fAmount: ""
                };
                expense.fAmount = formatCurrency(expense.amount, expense.currency);
                expensesAPI.addExpense(expense);
                modalOverlay.classList.remove("show");
                renderExpenses();
            });
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

function formatCurrency(amount, currency){
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
    }
    catch (error) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: "USD" }).format(amount);
    }
}

function onDeleteExpense(expense){
    console.log(expense);
    expensesAPI.deleteExpense(expense);
    renderExpenses();
}

async function onEditExpense(expense){
    const modal = await domAPI.generateEditExpenseModal(expense);
    const modalOverlay = document.getElementById(MODAL_SELECTOR);
    modalOverlay.innerHTML = "";
    modalOverlay.appendChild(modal);
    modalOverlay.classList.add("show");

    const form = modal.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newExpense = {
            name: formData.get("name"),
            amount: formData.get("amount"),
            currency: formData.get("currency"),
            category: formData.get("category"),
            date: formData.get("date"),
            fAmount: ""
        };
        newExpense.fAmount = formatCurrency(newExpense.amount, newExpense.currency);
        expensesAPI.updateExpense(expense, newExpense);
        modalOverlay.classList.remove("show");
        renderExpenses();
    });
}

function renderExpenses(){
    const expenses = expensesAPI.getExpenses();
    const expensesList = document.getElementById(EXPENSES_SELECTOR);
    if(expensesList){
        expensesList.innerHTML = "";
        expensesList.appendChild(domAPI.generateExpensesTable(expenses));
    }
}

function init(){
    handleAppearance();
    //categoriesListener();
    renderCategories();
    renderExpenses();
}

init();