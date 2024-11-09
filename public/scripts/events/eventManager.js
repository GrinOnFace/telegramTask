export class EventManager {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const eventManagerHTML = `
            <div class="event-manager">
                <h1>Менеджер мероприятий</h1>
                <form class="event-form" id="eventForm">
                    <div class="form-group">
                        <label for="eventName">Название мероприятия:</label>
                        <input type="text" id="eventName" name="eventName" required>
                    </div>
                    <div class="form-group">
                        <label for="eventDate">Дата мероприятия:</label>
                        <input type="date" id="eventDate" name="eventDate" required>
                    </div>
                    <button type="submit" class="submit-button">Добавить мероприятие</button>
                </form>
                <div class="event-list" id="eventList"></div>
            </div>
        `;
        this.container.innerHTML = eventManagerHTML;
        this.eventForm = this.container.querySelector('#eventForm');
        this.eventList = this.container.querySelector('#eventList');
    }

    attachEventListeners() {
        this.eventForm.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();
        const eventName = this.container.querySelector('#eventName').value;
        const eventDate = this.container.querySelector('#eventDate').value;
        
        this.addEvent(eventName, eventDate);
    }

    async addEvent(name, date) {
        const eventData = {
            name: name,
            date: date,
            clients: [],
            expenses: []
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Ответ сервера:', data);
                this.eventForm.reset();
                this.showSuccessMessage('Мероприятие успешно добавлено');
            } else {
                console.error('Ошибка при добавлении мероприятия:', data);
                this.showErrorMessage('Ошибка при добавлении мероприятия');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            this.showErrorMessage('Ошибка при отправке запроса');
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('message', `message--${type}`);
        this.container.insertBefore(messageElement, this.eventList);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}