const categoriesAPI = (function(){

    function generateUniqueId() {
        return uuid.v4();
    }

    function addCategory(category){
        
        const categories = getCategories();
        const found = categories.find(cat => cat.name === category.name); 
        if(found){
            alert("Category name already exists");
            return;
        }
        
        category.id = generateUniqueId();
        categories.push(category)
        saveData(CATEGORIES_KEY, categories);
    }

    function getCategories(){
        const data = getData(CATEGORIES_KEY);
        if(data === null){
            return []
        }
        return data;
    }

    function deleteCategory(category){
        if (expensesAPI.hasCategory(category.id)){
            alert("Cannot delete category as it is in use");
            return;
        }
        let categories = getCategories();
        categories = categories.filter(c => c.name !== category.name);
        saveData(CATEGORIES_KEY, categories);
    }

    function updateCategory(categoryToUpdate, newCategory) {
        let categories = getCategories();
        const index = categories.findIndex(cat => cat.name === categoryToUpdate.name);
        
        if (index !== -1) {
            categories[index] = { ...categories[index], ...newCategory };
            saveData(CATEGORIES_KEY, categories);
        } else {
            console.error("Category not found");
        }
    }
    return {
        addCategory,
        getCategories,
        deleteCategory,
        updateCategory
    }
})();


const currenciesAPI = (function(){
    async function getCurrencies(){
        let currencies = await getData(CURRENCIES_KEY); // Assuming this function retrieves data synchronously

        if(currencies){
            // If currencies are already available synchronously, return them immediately
            return currencies;
        }

        // If currencies are not available synchronously, fetch them asynchronously
        try {
            const response = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json");
            const data = await response.json();
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== "")
            );
            currencies = filteredData;
            saveCurrencies(currencies); // Uncomment if you want to save the currencies

            return data; // Return the currencies data
        } catch (error) {
            console.error('Error fetching currencies:', error);
            throw error; // Propagate the error up
        }
    }

    async function convert(amount, fromCurrency, toCurrency){
        // If currencies are not available synchronously, fetch them asynchronously
        try {
            const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`);
            const data = await response.json();
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== "")
            );
            conversion = filteredData[fromCurrency][toCurrency];
            //console.log( amount * conversion);
            return amount * conversion; // Return the converted amount
        } catch (error) {
            console.error('Error fetching currencies:', error);
            throw error; // Propagate the error up
        }
    }

    function saveCurrencies(currencies){
        saveData(CURRENCIES_KEY, currencies);
    }

    return {
        getCurrencies,
        saveCurrencies,
        convert
    }
})();


const expensesAPI = (function(){
    
    function generateUniqueId() {
        return uuid.v4();
    }

    function addExpense(expense){
        const expenses = getExpenses();
        expense.id = generateUniqueId();
        expenses.push(expense)
        saveData(EXPENSES_KEY, expenses);
    }


    function getExpenses(){
        const data = getData(EXPENSES_KEY);
        if(data === null){
            return []
        }
        return data;
    }

    function deleteExpense(expense){
        let expenses = getExpenses();
        expenses = expenses.filter(e => e.id !== expense.id);
        saveData(EXPENSES_KEY, expenses);
    }

    function updateExpense(expenseToUpdate, newExpense){
        deleteExpense(expenseToUpdate);
        addExpense(newExpense);
    }

    // Check if any expense has the given category
    function hasCategory(category){
        const expenses = getExpenses();
        return expenses.some(expense => expense.category === category);
    }

    // Gets all the expenses of the given category
    function getExpensesByCategory(category){
        const expenses = getExpenses();
        return expenses.filter(expense => expense.category === category);
    }

    async function calculateTotalExpenses(budgetCurrency = budgetAPI.getBudget().currency, expenses = getExpenses()) {
        let total = 0;
    
        for (const expense of expenses) {
            const expenseAmount = parseFloat(expense.amount);
            if (expense.currency !== budgetCurrency) {
                // Convert the expense amount to the budget currency
                const convertedAmount = await currenciesAPI.convert(expenseAmount, expense.currency, budgetCurrency);
                total += convertedAmount;
            } else {
                total += expenseAmount;
            }
        }
        return total;
    }



    return {
        addExpense,
        getExpenses,
        deleteExpense,
        updateExpense,
        hasCategory,
        calculateTotalExpenses,
        getExpensesByCategory
    }
})();


const budgetAPI = (function(){
    
    function setBudget(budget){
        saveData(BUDGET_KEY, budget);
    }

    function getBudget(){
        const data = getData(BUDGET_KEY);
        if(data === null){
            return {
            amount: 0,
            currency: "USD"
        };
        }
        return data;
    }

    function resetBudget(){
        const budget = {
            amount: 0,
            currency: "USD"
        };

        saveData(BUDGET_KEY, budget);
    }

    function updateBudget(budgetToUpdate, newBudget){
        deleteBudget(budgetToUpdate);
        addExpense(newBudget);
    }

    async function convertBudget(budget, newCurrency){
        const budgetAmount = parseFloat(budget.amount);
        const budgetCurrency = budget.currency;
        if (budgetCurrency !== newCurrency) {
            // Convert the budget amount to the new currency
            const convertedAmount = await currenciesAPI.convert(budgetAmount, budgetCurrency, newCurrency);
            return {
                amount: convertedAmount,
                currency: newCurrency
            };
        } else {
            return budget;
        }
    }


    return {
        setBudget,
        getBudget,
        resetBudget,
        updateBudget,
        convertBudget
    }
})();
