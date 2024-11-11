import { API } from '../config/api.js';

export class SummaryTable {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const currentYear = new Date().getFullYear();
        
        const summaryTableHTML = `
            <div class="summary-table">
                <h1 class="summary-table__title">Годовая сводка</h1>
                <div class="year-selector">
                    <input type="number" id="yearSelector" min="2000" max="2100" value="${currentYear}">
                    <button id="loadSummaryButton">Загрузить данные</button>
                </div>
                <table class="summary-table__content">
                    <thead>
                        <tr>
                            <th>Месяц</th>
                            <th>Оборот</th>
                            <th>Прибыль</th>
                            <th>Маржин</th>
                            <th>кол. Мер.</th>
                            <th>ЧМ</th>
                            <th>ЧМ новые</th>
                            <th>Ср. чек</th>
                            <th>СН</th>
                            <th>Продв</th>
                            <th>Орграсходы</th>
                            <th>Чистыми</th>
                            <th>Инвестиции</th>
                            <th>Налоги</th>
                            <th>Деньги</th>
                        </tr>
                    </thead>
                    <tbody id="summaryTableBody"></tbody>
                    <tfoot>
                        <tr id="summaryTableFooter">
                            <td>ИТОГО</td>
                            <td colspan="14"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
        this.container.innerHTML = summaryTableHTML;
    }

    attachEventListeners() {
        this.container.querySelector('#loadSummaryButton').addEventListener('click', () => this.loadSummaryData());
    }

    async loadSummaryData() {
        const year = this.container.querySelector('#yearSelector').value;

        try {
            const summaryData = await API.getSummaryTable(year);
            this.displaySummaryData(summaryData.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    displaySummaryData(data) {
        const tbody = this.container.querySelector('#summaryTableBody');
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        
        const totals = this.initializeTotals();
        
        tbody.innerHTML = monthNames.map((monthName, index) => {
            const monthData = this.getMonthData(data, index + 1);
            this.updateTotals(totals, monthData);
            return this.createMonthRow(monthName, monthData);
        }).join('');

        this.updateFooter(totals);
    }

    initializeTotals() {
        return {
            turnover: 0,
            profit: 0,
            amountOfEvents: 0,
            amountOfHumanActivities: 0,
            amountOfNewHumanActivities: 0,
            promotion: 0,
            org: 0,
            netIncome: 0,
            investitions: 0,
            tax: 0,
            total: 0
        };
    }

    getMonthData(data, monthIndex) {
        return data[monthIndex] || {
            turnover: 0,
            profit: 0,
            marginality: 0,
            amountOfEvents: 0,
            amountOfHumanActivities: 0,
            amountOfNewHumanActivities: 0,
            averageCheck: 0,
            ch: 0,
            promotion: 0,
            org: 0,
            netIncome: 0,
            investitions: 0,
            tax: 0,
            total: 0
        };
    }

    updateTotals(totals, monthData) {
        Object.keys(totals).forEach(key => {
            totals[key] += monthData[key] || 0;
        });
    }

    createMonthRow(monthName, data) {
        return `
            <tr>
                <td>${monthName}</td>
                <td>${data.turnover || 0}</td>
                <td>${data.profit || 0}</td>
                <td>${(data.marginality * 100 || 0).toFixed(1)}%</td>
                <td>${data.amountOfEvents || 0}</td>
                <td>${data.amountOfHumanActivities || 0}</td>
                <td>${data.amountOfNewHumanActivities || 0}</td>
                <td>${Math.round(data.averageCheck) || 0}</td>
                <td>${Math.round(data.ch) || 0}</td>
                <td>${data.promotion || 0}</td>
                <td>${data.org || 0}</td>
                <td>${data.netIncome || 0}</td>
                <td>${data.investitions || 0}</td>
                <td>${data.tax || 0}</td>
                <td>${data.total || 0}</td>
            </tr>
        `;
    }

    updateFooter(totals) {
        const tfoot = this.container.querySelector('#summaryTableFooter');
        const averageCheck = Math.round(totals.turnover / totals.amountOfHumanActivities) || 0;
        const averageProfit = Math.round(totals.profit / totals.amountOfHumanActivities) || 0;
        const totalMarginality = ((totals.profit / totals.turnover) * 100 || 0).toFixed(1);

        tfoot.innerHTML = `
            <td>ИТОГО</td>
            <td>${totals.turnover}</td>
            <td>${totals.profit}</td>
            <td>${totalMarginality}%</td>
            <td>${totals.amountOfEvents}</td>
            <td>${totals.amountOfHumanActivities}</td>
            <td>${totals.amountOfNewHumanActivities}</td>
            <td>${averageCheck}</td>
            <td>${averageProfit}</td>
            <td>${totals.promotion}</td>
            <td>${totals.org}</td>
            <td>${totals.netIncome}</td>
            <td>${totals.investitions}</td>
            <td>${totals.tax}</td>
            <td>${totals.total}</td>
        `;
    }
} 