import { API } from '../config/api.js';

export class EarningTable {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const earningTableHTML = `
            <div class="earning-table">
                <h1 class="earning-table__title">Сводная таблица</h1>
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
                    <button id="loadTableButton">Загрузить данные</button>
                </div>
                <div class="table-container">
                    <table class="summary-table">
                        <tr>
                            <th>№</th>
                            <th>Мероприятие</th>
                            <th>Кол-во участ.</th>
                            <th>Новых</th>
                            <th>Сдано</th>
                            <th>Расход</th>
                            <th>Прибыль</th>
                            <th>СН</th>
                        </tr>
                        <tbody id="eventsTableBody"></tbody>
                        <tr class="total-row">
                            <td colspan="2">ИТОГО</td>
                            <td id="totalClients">0</td>
                            <td id="totalNewClients">0</td>
                            <td id="totalIncome">0</td>
                            <td id="totalExpenses">0</td>
                            <td id="totalProfit">0</td>
                            <td id="totalCH">0</td>
                        </tr>
                    </table>
                    <div class="additional-info">
                        <div class="expenses-section">
                            <div>Продвижение: <span id="promotionExpenses">0</span></div>
                            <div>Оргасходы: <span id="orgExpenses">0</span></div>
                            <div>Инвестиции: <span id="investitionExpenses">0</span></div>
                        </div>
                        <div class="deposit-section">
                            <div>Депозиты:</div>
                            <div>Внесено: <span id="depositIn">0</span></div>
                            <div>Списано: <span id="depositOut">0</span></div>
                        </div>
                        <div class="tax-section">
                            <div>Налоги: <span id="tax">0</span></div>
                        </div>
                        <div class="total-checkout">
                            <div>ИТОГО В КАССЕ: <span id="totalCheckout">0</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = earningTableHTML;
    }

    attachEventListeners() {
        this.container.querySelector('#loadTableButton').addEventListener('click', () => this.loadTableData());
    }

    async loadTableData() {
        const year = this.container.querySelector('#yearInput').value;
        const month = this.container.querySelector('#monthInput').value;

        try {
            const data = await API.getEarningTable(year, month);
            this.displayTableData(data);
        } catch (error) {
            console.error('Ошибка при получении данных таблицы:', error);
        }
    }

    displayTableData(data) {
        const eventsTableBody = this.container.querySelector('#eventsTableBody');
        
        if (data.data.events.length > 0) {
            eventsTableBody.innerHTML = data.data.events.map((event, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${event.name}</td>
                    <td>${event.amountOfClients}</td>
                    <td>${event.amountOfNewClients}</td>
                    <td>${event.totalIncome}</td>
                    <td>${event.totalExpenses}</td>
                    <td>${event.profit}</td>
                    <td>${event.ch || 0}</td>
                </tr>
            `).join('');
        } else {
            eventsTableBody.innerHTML = '<tr><td colspan="8">Нет данных</td></tr>';
        }

        if (data.data.incomes?.length > 0) {
            const additionalIncomes = data.data.incomes.map((income, index) => `
                <tr>
                    <td>${data.data.events.length + index + 1}</td>
                    <td>Дополнительный доход: ${income.name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${income.sum}</td>
                    <td>-</td>
                </tr>
            `).join('');
            eventsTableBody.innerHTML += additionalIncomes;
        }

        this.updateTotals(data.data.totalReport);
    }

    updateTotals(totalReport) {
        const totals = {
            '#totalClients': totalReport.amountOfClients,
            '#totalNewClients': totalReport.amountOfNewClients,
            '#totalIncome': totalReport.incomeSum,
            '#totalExpenses': totalReport.expensesSum,
            '#totalProfit': totalReport.profitSum,
            '#totalCH': totalReport?.totalCh?.toFixed(1),
            '#promotionExpenses': totalReport.promotionExpensesSum,
            '#orgExpenses': totalReport.orgExpensesSum,
            '#investitionExpenses': totalReport.investitionExpensesSum,
            '#depositIn': totalReport.depositIn,
            '#depositOut': totalReport.depositOut,
            '#tax': totalReport.tax
        };

        Object.entries(totals).forEach(([selector, value]) => {
            const element = this.container.querySelector(selector);
            if (element) {
                element.textContent = value;
            }
        });

        const checkoutElement = this.container.querySelector('#totalCheckout');
        checkoutElement.textContent = totalReport.totalCheckout;
        
        checkoutElement.className = '';
        if (totalReport.totalCheckout < 0) {
            checkoutElement.classList.add('negative-value');
        } else if (totalReport.totalCheckout > 0) {
            checkoutElement.classList.add('positive-value');
        }
    }
} 