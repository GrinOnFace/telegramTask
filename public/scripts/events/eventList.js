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
            const response = await fetch('http://localhost:3000/api/v1/events');
            const data = await response.json();
            if (data.status === 'OK') {
                this.events = data.data;
                this.displayEvents();
            } else {
                console.error('Ошибка при получении данных мероприятий');
            }
        } catch (error) {
            console.error('Ошибка при запросе данных мероприятий:', error);
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
            const response = await fetch(`http://localhost:3000/api/v1/events/${eventId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Мероприятие с ID ${eventId} успешно удалено.`);
                await this.fetchEvents();
            } else {
                console.error('Ошибка при удалении мероприятия:', await response.json());
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса на удаление мероприятия:', error);
        }
    }

    async showEventDetails(event) {
        const clientsList = await Promise.all(event.clients.map(async (client) => {
            const clientData = await this.fetchClientData(client.id);
            return `<li>
                <a href="#" class="client-link" data-client-id="${client.id}">
                    ${clientData.name} ${clientData.surname}
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
            <p><strong>ID:</strong> ${event.id}</p>
            <p><strong>Название:</strong> ${event.name}</p>
            <p><strong>Дата:</strong> ${event.date.year}.${event.date.month}.${event.date.day}</p>
            <h3>Клиенты:</h3>
            <ul>${clientsList.join('') || '<li>Нет клиентов</li>'}</ul>
            <h3>Расходы:</h3>
            <ul>${expensesList || '<li>Нет расходов</li>'}</ul>
            <h3>Добавить клиента:</h3>
            <input type="text" id="clientIdInput" placeholder="ID клиента" />
            <button id="addClientButton" data-event-id="${event.id}">Добавить клиента</button>
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
            const clientId = document.getElementById('clientIdInput').value;
            this.addClientToEvent(event.id, clientId);
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

    async addClientToEvent(eventId, clientId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/events/${eventId}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: clientId }),
            });

            if (response.ok) {
                console.log(`Клиент с ID ${clientId} успешно добавлен в мероприятие с ID ${eventId}.`);
                await this.fetchEvents();
            } else {
                console.error('Ошибка при добавлении клиента в мероприятие:', await response.json());
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса на добавление клиента в мероприятие:', error);
        }
    }

    async addExpenseToEvent(eventId, name, date, sum) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/events/${eventId}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, date, sum }),
            });

            if (response.ok) {
                console.log(`Расход успешно добавлен в мероприятие с ID ${eventId}.`);
                await this.fetchEvents();
                this.showEventDetails(this.events.find(event => event.id === eventId));
            } else {
                console.error('Ошибка при добавлении расхода в мероприятие:', await response.json());
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса на добавление расхода в мероприятие:', error);
        }
    }

    async fetchClientData(clientId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/clients/${clientId}`);
            const data = await response.json();
            if (data.status === 'OK') {
                return data.data;
            } else {
                console.error('Ошибка при получении данных клиента');
                return { name: 'Неизвестно', surname: 'Неизвестно' };
            }
        } catch (error) {
            console.error('Ошибка при запросе данных клиента:', error);
            return { name: 'Неизвестно', surname: 'Неизвестно' };
        }
    }

    async showClientDetails(clientId) {
        const clientData = await this.fetchClientData(clientId);
        
        const clientDetailsHTML = `
            <div class="client-details">
                <h3>Информация о клиенте</h3>
                <p><strong>Имя:</strong> ${clientData.name}</p>
                <p><strong>Фамилия:</strong> ${clientData.surname}</p>
                <p><strong>Дата:</strong> ${clientData.date}</p>
                <p><strong>Депозит:</strong> ${clientData.deposit}</p>
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
