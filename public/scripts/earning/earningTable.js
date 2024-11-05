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
                    <input type="number" id="yearInput" min="2000" max="2100" value="${currentYear}">
                    <select id="monthInput">
                        ${Array.from({length: 12}, (_, i) => `<option value="${i + 1}" ${i + 1 === currentMonth ? 'selected' : ''}>${i + 1}</option>`).join('')}
                    </select>
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
            const response = await fetch(`http://localhost:3000/api/v1/earning/${year}/${month}`);
            const data = await response.json();

            if (response.ok) {
                this.displayTableData(data);
            } else {
                console.error('Ошибка при получении данных таблицы:', data);
            }
        } catch (error) {
            console.error('Ошибка при запросе данных таблицы:', error);
        }
    }

    displayTableData(data) {
        const eventsTableBody = this.container.querySelector('#eventsTableBody');
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

        if (data.data.incomes && data.data.incomes.length > 0) {
            data.data.incomes.forEach((income, index) => {
                eventsTableBody.innerHTML += `
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
                `;
            });
        }

        const totalReport = data.data.totalReport;
        
        this.container.querySelector('#totalClients').textContent = data.data.totalReport.amountOfClients;
        this.container.querySelector('#totalNewClients').textContent = data.data.totalReport.amountOfNewClients;
        this.container.querySelector('#totalIncome').textContent = data.data.totalReport.incomeSum;
        this.container.querySelector('#totalExpenses').textContent = data.data.totalReport.expensesSum;
        this.container.querySelector('#totalProfit').textContent = data.data.totalReport.profitSum;
        this.container.querySelector('#totalCH').textContent = data.data.totalReport.totalCh.toFixed(1);

        this.container.querySelector('#promotionExpenses').textContent = totalReport.promotionExpensesSum;
        this.container.querySelector('#orgExpenses').textContent = totalReport.orgExpensesSum;
        this.container.querySelector('#investitionExpenses').textContent = totalReport.investitionExpensesSum;

        this.container.querySelector('#depositIn').textContent = totalReport.depositIn;
        this.container.querySelector('#depositOut').textContent = totalReport.depositOut;

        this.container.querySelector('#tax').textContent = totalReport.tax;

        const checkoutElement = this.container.querySelector('#totalCheckout');
        checkoutElement.textContent = totalReport.totalCheckout;
        
        if (totalReport.totalCheckout < 0) {
            checkoutElement.classList.add('negative-value');
        } else if (totalReport.totalCheckout > 0) {
            checkoutElement.classList.add('positive-value');
        }
    }
} 