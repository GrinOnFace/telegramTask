import { API } from '../config/api.js';

export class SocialStats {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        const socialStatsHTML = `
            <div class="social-stats">
                <h2 class="social-stats__title">Статистика социальных сетей</h2>
                <div class="input-section">
                    <div class="input-group">
                        <label>Дата:</label>
                        <input type="date" id="socialDate">
                    </div>
                    <div class="input-group">
                        <label>Количество:</label>
                        <input type="number" id="socialCount" min="0">
                    </div>
                    <div class="button-group">
                        <button id="addVkButton">Добавить ВК</button>
                        <button id="addTelegramButton">Добавить Telegram</button>
                        <button id="addChatsButton">Добавить Чаты</button>
                    </div>
                </div>
                <div class="data-section">
                    <div class="year-month-selector">
                        <div class="selector-group">
                            <label>Год:</label>
                            <input type="number" id="yearSelector" min="2000" max="2100" value="${currentYear}">
                        </div>
                        <div class="selector-group">
                            <label>Месяц:</label>
                            <select id="monthSelector">
                                ${Array.from({length: 12}, (_, i) => {
                                    const month = i + 1;
                                    return `<option value="${month}" ${month === currentMonth ? 'selected' : ''}>
                                        ${new Date(2000, i).toLocaleString('ru', {month: 'long'})}
                                    </option>`;
                                }).join('')}
                            </select>
                        </div>
                        <button id="loadStatsButton">Загрузить данные</button>
                    </div>
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
        this.container.innerHTML = socialStatsHTML;
    }

    attachEventListeners() {
        this.container.querySelector('#loadStatsButton').addEventListener('click', () => this.loadStats());
        this.container.querySelector('#addVkButton').addEventListener('click', () => this.addSocialStat('vk'));
        this.container.querySelector('#addTelegramButton').addEventListener('click', () => this.addSocialStat('telegram'));
        this.container.querySelector('#addChatsButton').addEventListener('click', () => this.addSocialStat('chats'));
    }

    async addSocialStat(socnet) {
        const date = this.container.querySelector('#socialDate').value;
        const count = this.container.querySelector('#socialCount').value;

        if (!date || !count) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await API.createSocialStat(socnet, { date, count });
            this.container.querySelector('#socialDate').value = '';
            this.container.querySelector('#socialCount').value = '';
            alert('Данные успешно добавлены');
            
            const year = this.container.querySelector('#yearSelector').value;
            const month = this.container.querySelector('#monthSelector').value;
            await this.loadSocialStats(socnet, year, month);
        } catch (error) {
            console.error(`Ошибка при добавлении данных ${socnet}:`, error);
            alert(error.message || 'Ошибка при добавлении данных');
        }
    }

    async loadStats() {
        const year = this.container.querySelector('#yearSelector').value;
        const month = this.container.querySelector('#monthSelector').value;

        await Promise.all([
            this.loadSocialStats('vk', year, month),
            this.loadSocialStats('telegram', year, month),
            this.loadSocialStats('chats', year, month)
        ]);
    }

    async loadSocialStats(socnet, year, month) {
        try {
            const data = await API.getSocialStats(socnet, year, month);
            this.displaySocialStats(socnet, data);
        } catch (error) {
            console.error(`Ошибка при получении данных ${socnet}:`, error);
        }
    }

    displaySocialStats(socnet, data) {
        const table = this.container.querySelector(`#${socnet}Table tbody`);
        
        table.innerHTML = data.data.map(stat => `
            <tr>
                <td>${stat.year}-${stat.month}-${stat.day}</td>
                <td>${stat.count}</td>
                <td>
                    <button class="delete-button" data-id="${stat.id}" data-socnet="${socnet}">
                        Удалить
                    </button>
                </td>
            </tr>
        `).join('');

        table.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => this.deleteSocialStat(button.dataset.socnet, button.dataset.id));
        });
    }

    async deleteSocialStat(socnet, id) {
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
            return;
        }

        try {
            await API.deleteSocialStat(socnet, id);
            
            const year = this.container.querySelector('#yearSelector').value;
            const month = this.container.querySelector('#monthSelector').value;
            await this.loadSocialStats(socnet, year, month);
        } catch (error) {
            console.error('Ошибка при удалении данных:', error);
            alert(error.message || 'Ошибка при удалении данных');
        }
    }
} 