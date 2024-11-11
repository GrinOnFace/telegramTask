import { API } from '../config/api.js';

export class EventList {
    constructor(container) {
        this.container = container;
        this.events = [];
        this.render();
        this.fetchEvents();
    }

    render() {
        const eventListHTML = `
            <div class="event-list">
                <h1 class="event-list__title">Список мероприятий</h1>
                <table class="event-list__table" id="eventTable">
                    <thead class="event-list__table-head">
                        <tr>
                            <th class="event-list__table-header">Название</th>
                            <th class="event-list__table-header">Дата</th>
                            <th class="event-list__table-header">Количество клиентов</th>
                            <th class="event-list__table-header">Количество расходов</th>
                            <th class="event-list__table-header">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="event-list__table-body" id="eventTableBody"></tbody>
                </table>
                <div class="event-list__details" id="eventDetails"></div>
            </div>
        `;
        this.container.innerHTML = eventListHTML;
        this.eventTableBody = this.container.querySelector('#eventTableBody');
        this.eventDetails = this.container.querySelector('#eventDetails');
    }

    async fetchEvents() {
        try {
            const data = await API.getEvents();
            if (data.status === 'OK') {
                this.events = data.data;
                this.displayEvents();
            }
        } catch (error) {
            console.error('Ошибка при получении мероприятий:', error);
        }
    }

    displayEvents() {
        this.eventTableBody.innerHTML = '';
        this.events.forEach((event, index) => {
            const row = document.createElement('tr');
            row.classList.add('event-list__table-row');
            row.classList.add(index % 2 === 0 ? 'event-list__table-row--even' : 'event-list__table-row--odd');
            row.innerHTML = `
                <td class="event-list__table-cell">${event.name}</td>
                <td class="event-list__table-cell">${event.date.year}.${event.date.month}.${event.date.day}</td>
                <td class="event-list__table-cell">${event.clients.length}</td>
                <td class="event-list__table-cell">${event.expenses.length}</td>
                <td class="event-list__table-cell">
                    <button class="delete-event" data-event-id="${event.id}">Удалить</button>
                </td>
            `;
            row.addEventListener('click', () => this.showEventDetails(event));
            this.eventTableBody.appendChild(row);
        });

        this.eventTableBody.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = button.dataset.eventId;
                this.deleteEvent(eventId);
            });
        });
    }

    async deleteEvent(eventId) {
        try {
            await API.deleteEvent(eventId);
			await this.fetchEvents();
        } catch (error) {
            console.error('Ошибка при удалении мероприятия:', error);
        }
    }

    async showEventDetails(event) {
        const clientsList = await Promise.all(event.clients.map(async (client) => {
            const clientData = await this.fetchClientData(client.id);
            return `<li>
                <a href="#" class="client-link" data-client-id="${client.id}">
                    ${clientData.name} ${clientData.surname} - ${client.deposit}
                </a>
            </li>`;
        }));

        const expensesList = event.expenses.map(expense => 
            `<li>
                ${expense.name} (${expense.date}): ${expense.sum}
            </li>`
        ).join('');

        this.eventDetails.innerHTML = `
            <h2 class="event-list__details-title">Детали мероприятия</h2>
            <p><strong>Название:</strong> ${event.name}</p>
            <p><strong>Дата:</strong> ${event.date.year}.${event.date.month}.${event.date.day}</p>
            <h3>Клиенты:</h3>
            <ul>${clientsList.join('') || '<li>Нет клиентов</li>'}</ul>
            <h3>Расходы:</h3>
            <ul>${expensesList || '<li>Нет расходов</li>'}</ul>
            <h3>Добавить клиента:</h3>
            <div class="add-client-form">
                <input type="text" id="clientName" placeholder="Имя клиента" required />
                <input type="text" id="clientSurname" placeholder="Фамилия клиента" required />
                <input type="number" id="clientDeposit" placeholder="Депозит" required step="0.01" />
                <button id="addClientButton" data-event-id="${event.id}">Добавить клиента</button>
            </div>
            <h3>Добавить расход:</h3>
            <input type="text" id="expenseName" placeholder="Название расхода" />
            <input type="date" id="expenseDate" />
            <input type="number" id="expenseSum" placeholder="Сумма" step="0.01" />
            <button id="addExpenseButton" data-event-id="${event.id}">Добавить расход</button>
        `;
        this.eventDetails.classList.add('event-list__details--active');

        this.eventDetails.querySelectorAll('.client-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const clientId = e.target.dataset.clientId;
                this.showClientDetails(clientId);
            });
        });

        this.eventDetails.querySelector('#addClientButton').addEventListener('click', () => {
            const name = document.getElementById('clientName').value;
            const surname = document.getElementById('clientSurname').value;
            const deposit = document.getElementById('clientDeposit').value;
            
            if (!name || !surname || !deposit) {
                alert('Пожалуйста, заполните все поля для клиента');
                return;
            }
            
            this.addClientToEvent(event.id, { name, surname, deposit });
        });

        this.eventDetails.querySelector('#addExpenseButton').addEventListener('click', () => {
            const expenseName = document.getElementById('expenseName').value;
            const expenseDate = document.getElementById('expenseDate').value;
            const expenseSum = document.getElementById('expenseSum').value;
            this.addExpenseToEvent(event.id, expenseName, expenseDate, expenseSum);
        });

        setTimeout(() => {
            this.eventDetails.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    async addClientToEvent(eventId, clientData) {
        try {
            await API.addClientToEvent(eventId, {
                name: clientData.name,
                surname: clientData.surname,
                deposit: clientData.deposit
            });
            await this.fetchEvents();
            this.showEventDetails(this.events.find(event => event.id === eventId));
        } catch (error) {
            console.error('Ошибка при добавлении клиента:', error);
        }
    }

    async addExpenseToEvent(eventId, name, date, sum) {
        try {
            await API.addExpenseToEvent(eventId, { name, date, sum });
            await this.fetchEvents();
            this.showEventDetails(this.events.find(event => event.id === eventId));
        } catch (error) {
            console.error('Ошибка при добавлении расхода:', error);
        }
    }

    async fetchClientData(clientId) {
        try {
            const data = await API.getClientData(clientId);
            if (data.status === 'OK' && data.data) {
                return data.data;
            }
            return this.getDefaultClientData();
        } catch (error) {
            console.error('Ошибка при получении данных клиента:', error);
            return this.getDefaultClientData();
        }
    }

    getDefaultClientData() {
        return {
            name: 'Неизвестно',
            surname: 'Неизвестно',
            year: 'Неизвестно',
            month: 'Неизвестно',
            day: 'Неизвестно',
            id: 'Неизвестно'
        };
    }

    async showClientDetails(clientId) {
        const clientData = await this.fetchClientData(clientId);
        
        const clientDetailsHTML = `
            <div class="client-details">
                <h3>Информация о клиенте</h3>
                <p><strong>Имя:</strong> ${clientData.name}</p>
                <p><strong>Фамилия:</strong> ${clientData.surname}</p>
                <p><strong>Дата:</strong> ${clientData.year}.${clientData.month}.${clientData.day}</p>
            </div>
        `;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                ${clientDetailsHTML}
                <button class="close-button">Закрыть</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-button').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}
