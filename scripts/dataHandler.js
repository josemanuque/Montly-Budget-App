const categoriesAPI = (function(){

    function addCategory(category){
        const categories = getCategories();
        const found = categories.find(cat => cat.name === category.name);
        
        if(found){
            alert("Category already exists");
            return;
        }
        
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
        if (expensesAPI.hasCategory(category.name)){
            alert("Cannot delete category as it is in use");
            return;
        }
        let categories = getCategories();
        categories = categories.filter(c => c.name !== category.name);
        saveData(CATEGORIES_KEY, categories);
    }

    function updateCategory(categoryToUpdate, newCategory){
        deleteCategory(categoryToUpdate);
        addCategory(newCategory);
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

    function saveCurrencies(currencies){
        saveData(CURRENCIES_KEY, currencies);
    }

    return {
        getCurrencies,
        saveCurrencies
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


    return {
        addExpense,
        getExpenses,
        deleteExpense,
        updateExpense,
        hasCategory
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


    return {
        setBudget,
        getBudget,
        resetBudget,
        updateBudget
    }
})();
