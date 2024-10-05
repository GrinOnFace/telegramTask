export class ClientManager {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const clientManagerHTML = `
            <div class="client-manager">
                <h1>Менеджер клиентов</h1>
                <form class="client-form" id="clientForm">
                    <div class="form-group">
                        <label for="firstName">Имя:</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Фамилия:</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                    <div class="form-group">
                        <label for="deposit">Депозит:</label>
                        <input type="number" id="deposit" name="deposit" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="date">Дата:</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    <button type="submit" class="submit-button">Добавить клиента</button>
                </form>
                <div class="client-list" id="clientList"></div>
            </div>
        `;
        this.container.innerHTML = clientManagerHTML;
        this.clientForm = this.container.querySelector('#clientForm');
        this.clientList = this.container.querySelector('#clientList');
    }

    attachEventListeners() {
        this.clientForm.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();
        const firstName = this.container.querySelector('#firstName').value;
        const lastName = this.container.querySelector('#lastName').value;
        const deposit = this.container.querySelector('#deposit').value;
        const date = this.container.querySelector('#date').value;
        
        this.addClient(firstName, lastName, deposit, date);
        this.clientForm.reset();
    }

    addClient(firstName, lastName, deposit, date) {
		//Здесь ручка добавления клиента
    }
}
