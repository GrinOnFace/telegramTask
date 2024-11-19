import { API } from '../config/api.js';

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
                <h1 class="expense-list__title">Список расходов, доходов, депозитов и налогов</h1>
                <div class="date-selector">
                    <div class="selector-group">
                        <label>Год:</label>
                        <input type="number" id="yearInput" min="2000" max="2100" value="${currentYear}">
                    </div>
                    <div class="selector-group">
                        <label>Месяц:</label>
                        <select id="monthInput">
                            ${Array.from({length: 12}, (_, i) => {
                                const month = i + 1;
                                return `<option value="${month}" ${month === currentMonth ? 'selected' : ''}>
                                    ${new Date(2000, i).toLocaleString('ru', {month: 'long'})}
                                </option>`;
                            }).join('')}
                        </select>
                    </div>
                    <button id="loadExpensesButton">Загрузить данные</button>
                </div>
                <div class="expense-tables">
                    <div class="expense-table">
                        <h2>Продвижение</h2>
                        <table id="promotionsTable"></table>
                    </div>
                    <div class="expense-table">
                        <h2>Орграсходы</h2>
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
                    <div class="expense-table">
                        <h2>Налоги</h2>
                        <table id="taxesTable"></table>
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

        await Promise.all([
            this.fetchAndDisplayProfits(year, month),
            this.fetchAndDisplayExpenses('promotions', year, month),
            this.fetchAndDisplayExpenses('orgs', year, month),
            this.fetchAndDisplayExpenses('investitions', year, month),
            this.fetchAndDisplayDeposits('in', year, month),
            this.fetchAndDisplayDeposits('out', year, month),
            this.fetchAndDisplayTaxes(year, month)
        ]);
    }

    async fetchAndDisplayProfits(year, month) {
        try {
            const data = await API.getProfits(year, month);
            this.displayProfits(data);
        } catch (error) {
            console.error('Ошибка при получении доходов:', error);
        }
    }

    displayProfits(profits) {
        const table = this.container.querySelector('#profitsTable');
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Сумма</th>
                <th>Действия</th>
            </tr>
            ${profits.data.map(profit => `
                <tr>
                    <td>${profit.year}.${profit.month}.${profit.day}</td>
                    <td>${profit.name}</td>
                    <td>${profit.sum}</td>
                    <td>
                        <button class="expense-button" data-type="profits" data-id="${profit.id}">Удалить</button>
                    </td>
                </tr>
            `).join('')}
        `;
        
        table.querySelectorAll('.expense-button').forEach(button => {
            button.addEventListener('click', () => this.deleteItem('profits', button.dataset.id));
        });
    }

    async fetchAndDisplayExpenses(type, year, month) {
        try {
            const data = await API.getExpenses(type, year, month);
            this.displayExpenses(type, data);
        } catch (error) {
            console.error(`Ошибка при получении расходов ${type}:`, error);
        }
    }

    displayExpenses(type, expenses) {
        const table = this.container.querySelector(`#${type}Table`);
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Сумма</th>
                <th>Действия</th>
            </tr>
            ${expenses.data.map(expense => `
                <tr>
                    <td>${expense.year}.${expense.month}.${expense.day}</td>
                    <td>${expense.name}</td>
                    <td>${expense.sum}</td>
                    <td>
                        <button class="expense-button" data-type="${type}" data-id="${expense.id}">Удалить</button>
                    </td>
                </tr>
            `).join('')}
        `;
        
        table.querySelectorAll('.expense-button').forEach(button => {
            button.addEventListener('click', () => this.deleteItem(type, button.dataset.id));
        });
    }

    async fetchAndDisplayDeposits(type, year, month) {
        try {
            const data = await API.getDeposits(type, year, month);
            this.displayDeposits(type, data);
        } catch (error) {
            console.error(`Ошибка при получении депозитов ${type}:`, error);
        }
    }

    displayDeposits(type, deposits) {
        const table = this.container.querySelector(`#deposits${type.charAt(0).toUpperCase() + type.slice(1)}Table`);
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Сумма</th>
                <th>Действия</th>
            </tr>
            ${Object.keys(deposits.data).length !== 0 ? `
            <tr>
                <td data-label="Дата">${deposits.data.year}.${deposits.data.month}.${deposits.data.day}</td>
                <td data-label="Название">${deposits.data.type}</td>
                <td data-label="Сумма">${deposits.data.sum}</td>
                <td data-label="Действия">
                    <button class="expense-button" 
                        data-type="${type}" 
                        data-year="${deposits.data.year}"
                        data-month="${deposits.data.month}">
                        Удалить
                    </button>
                    </td>
                </tr>
            ` : ''}
        `;
        
        table.querySelector('.expense-button').addEventListener('click', (e) => {
            const button = e.target;
            this.deleteDeposit(
                button.dataset.type,
                button.dataset.year,
                button.dataset.month
            );
        });
    }

    async deleteDeposit(type, year, month) {
        if (!confirm('Вы уверены, что хотите удалить этот депозит?')) {
            return;
        }

        try {
            await API.deleteDeposit(type, year, month);
            const currentYear = this.container.querySelector('#yearInput').value;
            const currentMonth = this.container.querySelector('#monthInput').value;
            await this.fetchAndDisplayDeposits(type, currentYear, currentMonth);
        } catch (error) {
            console.error('Ошибка при удалении депозита:', error);
        }
    }

    async deleteItem(type, id) {
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
            return;
        }

        try {
            if (type === 'profits') {
                await API.deleteProfit(id);
            } else if (type === 'promotions' || type === 'orgs' || type === 'investitions') {
                await API.deleteExpense(type, id);
            } 
            await this.loadExpenses();
        } catch (error) {
            console.error('Ошибка при удалении записи:', error);
        }
    }

    async fetchAndDisplayTaxes(year, month) {
        try {
            const data = await API.getTaxes(year, month);
            this.displayTaxes(data);
        } catch (error) {
            console.error('Ошибка при получении налогов:', error);
        }
    }

    displayTaxes(taxes) {
        const table = this.container.querySelector('#taxesTable');
        table.innerHTML = `
            <tr>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Действия</th>
            </tr>
            ${Object.keys(taxes.data).length !== 0 ? `
            <tr>
                <td data-label="Дата">${taxes.data.year}.${taxes.data.month}.${taxes.data.day}</td>
                <td data-label="Сумма">${taxes.data.sum}</td>
                <td data-label="Действия">
                    <button class="expense-button" 
                        data-year="${taxes.data.year}"
                        data-month="${taxes.data.month}">
                        Удалить
                    </button>
                </td>
            </tr>
            ` : ''}
        `;
        
        table.querySelector('.expense-button').addEventListener('click', (e) => {
            const button = e.target;
            this.deleteTax(button.dataset.year, button.dataset.month);
        });
    }

    async deleteTax(year, month) {
        if (!confirm('Вы уверены, что хотите удалить налог?')) {
            return;
        }

        try {
            await API.deleteTax(year, month);
            const currentYear = this.container.querySelector('#yearInput').value;
            const currentMonth = this.container.querySelector('#monthInput').value;
            await this.fetchAndDisplayTaxes(currentYear, currentMonth);
        } catch (error) {
            console.error('Ошибка при удалении налога:', error);
        }
    }
}
