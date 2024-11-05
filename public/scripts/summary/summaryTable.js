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
                <div class="social-stats">
                    <h2 class="social-stats__title">Статистика социальных сетей</h2>
                    <div class="social-stats__tables">
                        <div class="social-stats__table">
                            <h3>ВКонтакте</h3>
                            <table id="vkTable" class="summary-table__content">
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Количество</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div class="social-stats__table">
                            <h3>Telegram</h3>
                            <table id="telegramTable" class="summary-table__content">
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Количество</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div class="social-stats__table">
                            <h3>Чаты</h3>
                            <table id="chatsTable" class="summary-table__content">
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Количество</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = summaryTableHTML;
    }

    attachEventListeners() {
        this.container.querySelector('#loadSummaryButton').addEventListener('click', () => this.loadSummaryData());
    }

    async loadSummaryData() {
        const year = this.container.querySelector('#yearSelector').value;
        const month = new Date().getMonth() + 1; 

        try {
            const summaryResponse = await fetch(`http://localhost:3000/api/v1/summary/${year}`);
            const summaryData = await summaryResponse.json();

            if (summaryResponse.ok) {
                this.displaySummaryData(summaryData.data);
            }

            await Promise.all([
                this.loadSocialStats('vk', year, month),
                this.loadSocialStats('telegram', year, month),
                this.loadSocialStats('chats', year, month)
            ]);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    async loadSocialStats(socnet, year, month) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/social_stats/${socnet}/${year}/${month}`);
            const data = await response.json();

            if (response.ok) {
                this.displaySocialStats(socnet, data);
            } else {
                console.error(`Ошибка при получении данных ${socnet}:`, data);
            }
        } catch (error) {
            console.error(`Ошибка при запросе данных ${socnet}:`, error);
        }
    }

    displaySocialStats(socnet, data) {
        const table = this.container.querySelector(`#${socnet}Table tbody`);
        
        table.innerHTML = data.map(stat => `
            <tr>
                <td>${new Date(stat.date).toLocaleDateString()}</td>
                <td>${stat.count}</td>
                <td>
                    <button class="edit-button" data-id="${stat.id}" data-socnet="${socnet}">
                        ✏️
                    </button>
                    <button class="delete-button" data-id="${stat.id}" data-socnet="${socnet}">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');

        table.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => this.editSocialStat(button.dataset.socnet, button.dataset.id));
        });

        table.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => this.deleteSocialStat(button.dataset.socnet, button.dataset.id));
        });
    }

    async editSocialStat(socnet, id) {
        const newCount = prompt('Введите новое количество:');
        if (newCount === null) return;

        try {
            const response = await fetch(`http://localhost:3000/api/v1/social_stats/${socnet}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    count: parseInt(newCount)
                })
            });

            if (response.ok) {
                const year = this.container.querySelector('#yearSelector').value;
                const month = new Date().getMonth() + 1;
                await this.loadSocialStats(socnet, year, month);
            } else {
                console.error('Ошибка при обновлении данных');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    async deleteSocialStat(socnet, id) {
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/social_stats/${socnet}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const year = this.container.querySelector('#yearSelector').value;
                const month = new Date().getMonth() + 1;
                await this.loadSocialStats(socnet, year, month);
            } else {
                console.error('Ошибка при удалении данных');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    displaySummaryData(data) {
        const tbody = this.container.querySelector('#summaryTableBody');
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        let totals = {
            turnover: 0, profit: 0, amountOfEvents: 0, amountOfHumanActivities: 0,
            amountOfNewHumanActivities: 0, promotion: 0, org: 0, netIncome: 0,
            investitions: 0, tax: 0, total: 0
        };

        tbody.innerHTML = monthNames.map((monthName, index) => {
            const monthData = data[index + 1] || {
                turnover: 0, profit: 0, marginality: 0, amountOfEvents: 0,
                amountOfHumanActivities: 0, amountOfNewHumanActivities: 0,
                averageCheck: 0, ch: 0, promotion: 0, org: 0, netIncome: 0,
                investitions: 0, tax: 0, total: 0
            };


            Object.keys(totals).forEach(key => {
                totals[key] += monthData[key] || 0;
            });

            return `
                <tr>
                    <td>${monthName}</td>
                    <td>${monthData.turnover || 0}</td>
                    <td>${monthData.profit || 0}</td>
                    <td>${(monthData.marginality * 100 || 0).toFixed(1)}%</td>
                    <td>${monthData.amountOfEvents || 0}</td>
                    <td>${monthData.amountOfHumanActivities || 0}</td>
                    <td>${monthData.amountOfNewHumanActivities || 0}</td>
                    <td>${Math.round(monthData.averageCheck) || 0}</td>
                    <td>${Math.round(monthData.ch) || 0}</td>
                    <td>${monthData.promotion || 0}</td>
                    <td>${monthData.org || 0}</td>
                    <td>${monthData.netIncome || 0}</td>
                    <td>${monthData.investitions || 0}</td>
                    <td>${monthData.tax || 0}</td>
                    <td>${monthData.total || 0}</td>
                </tr>
            `;
        }).join('');

        const tfoot = this.container.querySelector('#summaryTableFooter');
        tfoot.innerHTML = `
            <td>ИТОГО</td>
            <td>${totals.turnover}</td>
            <td>${totals.profit}</td>
            <td>${((totals.profit / totals.turnover) * 100 || 0).toFixed(1)}%</td>
            <td>${totals.amountOfEvents}</td>
            <td>${totals.amountOfHumanActivities}</td>
            <td>${totals.amountOfNewHumanActivities}</td>
            <td>${Math.round(totals.turnover / totals.amountOfHumanActivities) || 0}</td>
            <td>${Math.round(totals.profit / totals.amountOfHumanActivities) || 0}</td>
            <td>${totals.promotion}</td>
            <td>${totals.org}</td>
            <td>${totals.netIncome}</td>
            <td>${totals.investitions}</td>
            <td>${totals.tax}</td>
            <td>${totals.total}</td>
        `;
    }
} 