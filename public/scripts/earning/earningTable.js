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
        this.container.querySelector('#totalClients').textContent = data.amountOfClients;
        this.container.querySelector('#totalNewClients').textContent = data.amountOfNewClients;
        this.container.querySelector('#totalIncome').textContent = data.incomeSum;
        this.container.querySelector('#totalExpenses').textContent = data.expensesSum;
        this.container.querySelector('#totalProfit').textContent = data.profitSum;
        this.container.querySelector('#totalCH').textContent = data.totalCh;

        this.container.querySelector('#promotionExpenses').textContent = data.promotionExpensesSum;
        this.container.querySelector('#orgExpenses').textContent = data.orgExpensesSum;
        this.container.querySelector('#investitionExpenses').textContent = data.investitionExpensesSum;

        this.container.querySelector('#netIncome').textContent = data.netIncome;
        this.container.querySelector('#humanActivities').textContent = data.humanActivities;
        this.container.querySelector('#humanPayedActivities').textContent = data.humanPayedActivities || '0';
        this.container.querySelector('#averageExtraChargeCommon').textContent = data.averageExtraChargeCommon;
        this.container.querySelector('#averageExtraChargePayed').textContent = data.averageExtraChargePayed || '0';

        this.container.querySelector('#depositIn').textContent = data.depositIn;
        this.container.querySelector('#depositOut').textContent = data.depositOut;
        this.container.querySelector('#tax').textContent = data.tax;

        this.container.querySelector('#totalCheckout').textContent = data.totalCheckout;
    }
} 