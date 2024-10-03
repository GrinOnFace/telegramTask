export class EventManager {
    constructor(container) {
        this.container = container;
        this.events = [];
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
        this.eventForm.reset();
    }

    addEvent(name, date) {
        const event = { name, date };
        this.events.push(event);
        this.renderEvent(event);
    }

    renderEvent(event) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.innerHTML = `<strong>${event.name}</strong> - ${event.date}`;
        this.eventList.appendChild(eventElement);
    }
}