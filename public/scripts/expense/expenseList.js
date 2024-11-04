export class ExpenseList {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const expenseListHTML = `
            <div class="expense-list">
                <h1 class="expense-list__title">Список расходов, доходов и депозитов</h1>
                <div class="date-selector">
                    <input type="number" id="yearInput" min="2000" max="2100" value="${currentYear}">
                    <select id="monthInput">
                        ${Array.from({length: 12}, (_, i) => `<option value="${i + 1}" ${i + 1 === currentMonth ? 'selected' : ''}>${i + 1}</option>`).join('')}
                    </select>
                    <button id="loadExpensesButton">Загрузить данные</button>
                </div>
                <div class="expense-tables">
                    <div class="expense-table">
                        <h2>Продвижение</h2>
                        <table id="promotionsTable"></table>
                    </div>
                    <div class="expense-table">
                        <h2>Оргасходы</h2>
                        <table id="orgsTable"></table>
                    </div>
                    <div class="expense-table">
                        <h2>Инвестиции</h2>
                        <table id="investitionsTable"></table>
                    </div>
					 <div class="expense-table">
                        <h2>Доходы</h2>
                        <table id="profitsTable"></table>
                    </div>
                    <div class="expense-table">
                        <h2>Внесенные депозиты</h2>
                        <table id="depositsInTable"></table>
                    </div>
                    <div class="expense-table">
                        <h2>Списанные депозиты</h2>
                        <table id="depositsOutTable"></table>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = expenseListHTML;
    }

    attachEventListeners() {
        this.container.querySelector('#loadExpensesButton').addEventListener('click', () => this.loadExpenses());
    }

    async loadExpenses() {
        const year = this.container.querySelector('#yearInput').value;
        const month = this.container.querySelector('#monthInput').value;

        await this.fetchAndDisplayProfits(year, month);
        await this.fetchAndDisplayExpenses('promotions', year, month);
        await this.fetchAndDisplayExpenses('orgs', year, month);
        await this.fetchAndDisplayExpenses('investitions', year, month);
        await this.fetchAndDisplayDeposits('in', year, month);
        await this.fetchAndDisplayDeposits('out', year, month);
    }

    async fetchAndDisplayProfits(year, month) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/month/profits/${year}/${month}`);
            const data = await response.json();

            if (response.ok) {
                this.displayProfits(data);
            } else {
                console.error('Ошибка при получении доходов:', data);
            }
        } catch (error) {
            console.error('Ошибка при запросе доходов:', error);
        }
    }

    displayProfits(profits) {
        const table = this.container.querySelector('#profitsTable');
        console.log(profits);
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Сумма</th>
            </tr>
            ${profits.data.map(profit => `
                <tr>
                    <td>${profit.year}.${profit.month}.${profit.day}</td>
                    <td>${profit.name}</td>
                    <td>${profit.sum}</td>
                </tr>
            `).join('')}
        `;
    }

    async fetchAndDisplayExpenses(type, year, month) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/month/expenses/${type}/${year}/${month}`);
            const data = await response.json();

            if (response.ok) {
                this.displayExpenses(type, data);
            } else {
                console.error(`Ошибка при получении расходов ${type}:`, data);
            }
        } catch (error) {
            console.error(`Ошибка при запросе расходов ${type}:`, error);
        }
    }

    displayExpenses(type, expenses) {
        const table = this.container.querySelector(`#${type}Table`);
		console.log(expenses);
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Сумма</th>
            </tr>
            ${expenses.data.map(expense => `
                <tr>
                    <td>${expense.year}.${expense.month}.${expense.day}</td>
                    <td>${expense.name}</td>
                    <td>${expense.sum}</td>
                </tr>
            `).join('')}
        `;
    }

    async fetchAndDisplayDeposits(type, year, month) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/deposits/${type}/${year}/${month}`);
            const data = await response.json();

            if (response.ok) {
                this.displayDeposits(type, data);
            } else {
                console.error(`Ошибка при получении депозитов ${type}:`, data);
            }
        } catch (error) {
            console.error(`Ошибка при запросе депозитов ${type}:`, error);
        }
    }

    displayDeposits(type, deposits) {
        const table = this.container.querySelector(`#deposits${type.charAt(0).toUpperCase() + type.slice(1)}Table`);
        console.log(deposits);
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Сумма</th>
            </tr>
            ${deposits.data.map(deposit => `
                <tr>
                    <td>${deposit.year}.${deposit.month}.${deposit.day}</td>
                    <td>${deposit.name}</td>
                    <td>${deposit.sum}</td>
                </tr>
            `).join('')}
        `;
    }
}
