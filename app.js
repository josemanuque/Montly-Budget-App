const CATEGORIES_KEY = "Categories";
const EXPENSES_KEY = "Exp";
const APPEARANCE_KEY = "Appearance";
const CURRENCIES_KEY = "Currencies";
const BUDGET_KEY = "Budget";

// Selectors
const CATEGORIES_SELECTOR = "categories-container";
const MODAL_SELECTOR = "modal-overlay";
const EXPENSES_SELECTOR = "table-container";
const BUDGET_SELECTOR = "total-budget-value";
const TOTAL_EXPENSES_SELECTOR = "total-expenses-value";
const REMAINING_BUDGET_SELECTOR = "remaining-budget-value";
const OVERVIEW_CURRENCY_SELECTOR = "overview-currency-value";
const OVERVIEW_CURRENCY_DROPDOWN_SELECTOR = "currency-overview-dropdown";
const OVERVIEW_CATEGORY_SELECTOR = "overview-category-value";
const OVERVIEW_CATEGORY_DROPDOWN_SELECTOR = "category-overview-dropdown";
const TOTAL_CATEGORY_SELECTOR = "total-category-value";


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
    saveData(APPEARANCE_KEY, value);
}

function handleAppearance(){
    // Handle toggle click
    const themeSelect = document.getElementById("theme-select")

    // Check if user has set a preference
    document.documentElement.getAttribute("data-theme") === "dark" ? document.documentElement.setAttribute("data-theme","dark") : document.documentElement.setAttribute("data-theme","light");
    const appearance = getData(APPEARANCE_KEY);
    if(appearance === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setAppearance("dark");
        //return;
    } else if(appearance === "light" || appearance === "dark"){
        
        setAppearance(appearance);
        //return;
    }

    if(themeSelect){
        themeSelect.addEventListener("change", (e) => setAppearance(e.target.value));
        for (let i = 0; i < themeSelect.options.length; i++) {
            console.log(themeSelect.options[i].value);
            if (themeSelect.options[i].value === appearance) {
                themeSelect.options[i].selected = true;
                break;
            }
        }
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
    
        if (form) {
            const amountInput = document.querySelector('#amount');
            amountInput.addEventListener('input', () => {
                if (amountInput.validity.customError) {
                    amountInput.setCustomValidity('');
                }
            });
        
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
                if(expense.amount <= 0){
                    amountInput.setCustomValidity('Amount must be greater than 0');
                    amountInput.reportValidity();
                    return;
                }
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

function onChangeCategory(selectElement){
    const category = selectElement.value;
    if (category === "all") {
        renderExpenseSummary(category);
        renderExpenses();
        return;
    }
    const expenses = expensesAPI.getExpenses();
    const filteredExpenses = expenses.filter(e => e.category === category);
    
    const expensesList = document.getElementById(EXPENSES_SELECTOR);
    if(expensesList){
        expensesList.innerHTML = "";
        expensesList.appendChild(domAPI.generateExpensesTable(filteredExpenses));
    }
    renderBudget();
    renderExpenseSummary(category);
}

function renderExpenseSummary(category){
    domAPI.updateTotalExpensesPerCategory(category);
}


async function renderExpenses(){
    const expenses = expensesAPI.getExpenses();
    const expensesList = document.getElementById(EXPENSES_SELECTOR);
    if(expensesList){
        expensesList.innerHTML = "";
        expensesList.appendChild(domAPI.generateExpensesTable(expenses));
    }
    renderOverviewInfo();
    const currencyOptions = await domAPI.generateCategorySelect(true, ["small-dropdown"]);
    const currencyParent = document.getElementById(OVERVIEW_CATEGORY_SELECTOR); 
    if(currencyParent){
        currencyParent.innerHTML = "";
        currencyParent.appendChild(currencyOptions);
        currencyParent.addEventListener("change", (e) => onChangeCategory(e.target));
    }
}

async function onSetBudget(){
    console.log("Setting budget");
    const currentBudget = budgetAPI.getBudget();
    const modal = await domAPI.generateSetBudgetModal(currentBudget);
    const modalOverlay = document.getElementById(MODAL_SELECTOR);
    modalOverlay.innerHTML = "";
    modalOverlay.appendChild(modal);
    modalOverlay.classList.add("show");

    const form = modal.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const amount = formData.get("amount");
        const currency = formData.get("currency");
        const budget = {amount: amount, currency: currency};
        budgetAPI.setBudget(budget);
        modalOverlay.classList.remove("show");
        renderBudget();
    });
}

async function onChangeCurrency(selectElement){
    const currency = selectElement.value;
    let budget = budgetAPI.getBudget();
    budget = await budgetAPI.convertBudget(budget, currency);
    budgetAPI.setBudget(budget);
    renderBudget();
}

async function renderOverviewInfo(){
    const budget = budgetAPI.getBudget();
    const expenses = expensesAPI.getExpenses();
    const totalExpenses = await expensesAPI.calculateTotalExpenses(budget.currency, expenses);
    const remaining = budget.amount - totalExpenses;
    domAPI.updateTotalExpenses(totalExpenses);
    domAPI.updateRemainingBudget(remaining);
    domAPI.generatePieChart(totalExpenses, remaining);
    domAPI.generateCategoriesChart();
}

async function renderBudget(){
    const budget = budgetAPI.getBudget();
    const budgetElement = document.getElementById(BUDGET_SELECTOR);
    if(budgetElement){
        budgetElement.textContent = formatCurrency(budget.amount, budget.currency);
    }
    const expenses = expensesAPI.getExpenses();
    await renderOverviewInfo();
    const currencyOptions = await domAPI.generateCurrencySelect(undefined, ["small-dropdown"]);
    const currencyParent = document.getElementById(OVERVIEW_CURRENCY_SELECTOR); 
    if(currencyParent){
        currencyParent.innerHTML = "";
        currencyParent.appendChild(currencyOptions);
        currencyParent.addEventListener("change", (e) => onChangeCurrency(e.target));
    }
}


function onResetAll(){
    if(confirm("Are you sure you want to reset all data?")){
        localStorage.clear();
        location.reload();
    }
}

function onExportLocalStorage() {
    // Retrieve all data from local storage
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
    }

    // Convert the data to a JSON string
    const jsonString = JSON.stringify(localStorageData, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'localStorageData.json';

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
}


function onImportLocalStorage() {
    document.querySelector('#importLocalStorageInput').click();
}


function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                for (const key in importedData) {
                    if (importedData.hasOwnProperty(key)) {
                        localStorage.setItem(key, importedData[key]);
                    }
                }
                alert('Local storage imported successfully!');
                location.reload();
            } catch (error) {
                alert('Failed to import local storage: Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}

function initializeImportListener() {
    const importInput = document.querySelector('#importLocalStorageInput');
    if (importInput)
        importInput.addEventListener('change', handleFileImport);
}

function init(){
    handleAppearance();
    renderCategories();
    renderExpenses();
    renderBudget();
    initializeImportListener();
}

init();