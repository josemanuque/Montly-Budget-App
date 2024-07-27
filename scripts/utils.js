const domAPI = (function(){

    function generateCategoriesList(categories){
        const categoriesList = categories
            .map(cat => generateCategoryItem(cat))
            .map(node => node.outerHTML)
            .join("");
        return createNode(categoriesList, "ul", ["categories-list"]);
    }

    function generateCategoryItem(category){
        const categoryStr = `        
            <span class="category-name" style="background-color: ${category.color};">${category.name}</span>
            <div class="button-container">
                <button class="btn btn-primary" onclick='onEditCategory(${JSON.stringify(category)})'>Edit</button>
                <button class="btn btn-danger" onclick='onDeleteCategory(${JSON.stringify(category)})'>Delete</button>
            </div>
        `;
        
        return createNode(categoryStr, "li", ["category-item"]);
    }


    function generateEditCategoryModal(category){
        const modalStr = `
            <div class="modal-header-container">
                <h2>Update Category</h2>
                <button class="btn btn-icon-only i-exit right" onclick="onCloseModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="icon-delete" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
            <form action="">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" value="${category.name}">
                <label for="color">Color</label>
                <input type="color" id="color" name="color" value="${category.color}">
                <button class="btn btn-primary" id="addCategoryBtn">Update</button>
            </form>
        `;
        return createNode(modalStr, "div", ["modal"]);
    }

    function generateAddCategoryModal(){
        const modalStr = `
            <div class="modal-header-container">
                <h2>Add Category</h2>
                <button id="exitCategoriesModalBtn" class="btn btn-icon-only i-exit right"  onclick="onCloseModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="icon-delete" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
            <form id="addCategoryForm" action="">
                <label for="name">Name</label>
                <input type="text" id="name" name="name">
                <label for="color">Color</label>
                <input type="color" id="color" name="color">
                <button class="btn btn-primary" id="addCategoryBtn">Add</button>
            </form>
        `;
        return createNode(modalStr, "div", ["modal"]);
    }

    function generateExpenseItem(expense){
        const expenseStr = `
            <td data-label="Name">${expense.name}</td>
            <td data-label="Amount">${expense.amount}</td>
            <td data-label="Date">${expense.date}</td>
            <td data-label="Edit">
                <button class="btn btn-icon-only">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg>
                </button>
            </td>
            <td data-label="Delete">
                <button class="btn btn-icon-only">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon-delete" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </td>
        `;
        return createNode(expenseStr, "tr", []);
    }

    function generateExpensesTable(expenses){
        const tableHeadStr = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
        `;
        const tableBodyStr = expenses
            .map(expense => generateExpenseItem(expense))
            .map(node => node.outerHTML)
            .join("");
        const tableStr = `
            ${tableHeadStr}
            <tbody>
                ${tableBodyStr}
            </tbody>
        `;
        return createNode(tableStr, "table", []);
    }

    async function generateCurrencySelect(){
        try {
            const currencies = await currenciesAPI.getCurrencies();
            const currencyOptions = Object.keys(currencies)
                .map(currency => `<option value="${currency}">${currency}</option>`)
                .join("");
            return createNode(currencyOptions, "select", []);
        } catch (error) {
            console.error('Error generating currency select:', error);
            throw error;
        }
    }

    async function generateAddExpenseModal() {
        try {
            const select = await generateCurrencySelect();
            console.log(select);
            const modalStr = `
                <div class="modal-header-container">
                    <h2>Add Expense</h2>
                    <button id="exitCategoriesModalBtn" class="btn btn-icon-only i-exit right" onclick="onCloseModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="icon-delete" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </button>
                </div>
                <form action="">
                    <label for="name">Expense</label>
                    <input type="text" id="name" name="name">
                    <label for="money">Amount</label>
                    <input type="number" id="money" name="money">
                    <label for="currency">Currency</label>
                    <div class="select-wrapper">
                        ${select.outerHTML}
                    </div>
                    <label for="category">Category</label>
                    <div class="select-wrapper">
                        <select name="Category" id="category">
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <label for="date">Date</label>
                    <input type="date" id="date" name="date">
                    <button class="btn btn-primary" id="addCategoryBtn">Add</button>
                </form>
            `;
            return createNode(modalStr, "div", ["modal"]);
        } catch (error) {
            console.error('Error generating add expense modal:', error);
            throw error;
        }
    }

    function createNode(str, element, classes){
        const node = document.createElement(element);
        if(classes.length > 0)
            node.classList.add(classes);
        node.innerHTML = str;
        return node;
    }

    return {
        createNode,
        generateCategoriesList,
        generateEditCategoryModal,
        generateAddCategoryModal,
        generateExpensesTable,
        generateAddExpenseModal
    };
})();
