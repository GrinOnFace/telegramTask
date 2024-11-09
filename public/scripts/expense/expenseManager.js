export class ExpenseManager {
    constructor(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const expenseManagerHTML = `
            <div class="expense-manager">
                <h1 class="expense-manager__title">Менеджер расходов и доходов</h1>
                <div class="expense-forms">
                    <div class="expense-form">
                        <h2 class="expense-form__title">Продвижение</h2>
                        <form id="promotionForm">
                            <input type="date" id="promotionsDate" required>
                            <input type="text" id="promotionsName" placeholder="Название" required>
                            <input type="number" id="promotionsAmount" placeholder="Сумма" required>
                            <button type="submit">Добавить расход на продвижение</button>
                        </form>
                    </div>
                    <div class="expense-form">
                        <h2 class="expense-form__title">Оргасходы</h2>
                        <form id="orgForm">
                            <input type="date" id="orgsDate" required>
                            <input type="text" id="orgsName" placeholder="Название" required>
                            <input type="number" id="orgsAmount" placeholder="Сумма" required>
                            <button type="submit">Добавить оргасход</button>
                        </form>
                    </div>
                    <div class="expense-form">
                        <h2 class="expense-form__title">Инвестиции</h2>
                        <form id="investitionForm">
                            <input type="date" id="investitionsDate" required>
                            <input type="text" id="investitionsName" placeholder="Название" required>
                            <input type="number" id="investitionsAmount" placeholder="Сумма" required>
                            <button type="submit">Добавить инвестицию</button>
                        </form>
                    </div>
                    <div class="expense-form">
                        <h2 class="expense-form__title">Доходы</h2>
                        <form id="profitForm">
                            <input type="date" id="profitDate" required>
                            <input type="text" id="profitName" placeholder="Название" required>
                            <input type="number" id="profitAmount" placeholder="Сумма" required>
                            <button type="submit">Добавить доход</button>
                        </form>
                    </div>
                </div>
                <h1 class="expense-manager__title">Менеджер депозитов</h1>
                <div class="expense-forms">
                    <div class="expense-form">
                        <h2 class="expense-form__title">Внесение депозита</h2>
                        <form id="depositInForm">
                            <input type="date" id="depositInDate" required>
                            <input type="number" id="depositInAmount" placeholder="Сумма" required>
                            <button type="submit">Внести депозит</button>
                        </form>
                    </div>
                    <div class="expense-form">
                        <h2 class="expense-form__title">Списание депозита</h2>
                        <form id="depositOutForm">
                            <input type="date" id="depositOutDate" required>
                            <input type="number" id="depositOutAmount" placeholder="Сумма" required>
                            <button type="submit">Списать депозит</button>
                        </form>
                    </div>
                </div>
				<h1 class="expense-manager__title">Менеджер налогов</h1>
                <div class="expense-form">
                    <h2 class="expense-form__title">Налоги</h2>
                    <form id="taxForm">
                        <input type="date" id="taxDate" required>
                        <input type="number" id="taxAmount" placeholder="Сумма" required>
                        <button type="submit">Добавить налог</button>
                    </form>
                </div>
            </div>
        `;
        this.container.innerHTML = expenseManagerHTML;
    }

    attachEventListeners() {
        this.container.querySelector('#promotionForm').addEventListener('submit', (e) => this.handleSubmit(e, 'promotions'));
        this.container.querySelector('#orgForm').addEventListener('submit', (e) => this.handleSubmit(e, 'orgs'));
        this.container.querySelector('#investitionForm').addEventListener('submit', (e) => this.handleSubmit(e, 'investitions'));
        this.container.querySelector('#profitForm').addEventListener('submit', (e) => this.handleProfitSubmit(e));
        this.container.querySelector('#depositInForm').addEventListener('submit', (e) => this.handleDepositSubmit(e, 'in'));
        this.container.querySelector('#depositOutForm').addEventListener('submit', (e) => this.handleDepositSubmit(e, 'out'));
        this.container.querySelector('#taxForm').addEventListener('submit', (e) => this.handleTaxSubmit(e));
    }

    async handleSubmit(e, type) {
        e.preventDefault();
        const dateInput = this.container.querySelector(`#${type}Date`);
        const nameInput = this.container.querySelector(`#${type}Name`);
        const amountInput = this.container.querySelector(`#${type}Amount`);

        if (!dateInput || !nameInput || !amountInput) {
            console.error(`Не удалось найти все необходимые поля для типа ${type}`);
            return;
        }

        const date = dateInput.value;
        const name = nameInput.value;
        const sum = amountInput.value;

        if (!date || !name || !sum) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/v1/month/expenses/${type}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date, name, sum }),
            });

            if (response.ok) {
                alert(`Расход ${type} успешно добавлен`);
                e.target.reset();
            } else {
                alert(`Ошибка при добавлении расхода ${type}`);
            }
        } catch (error) {
            console.error(`Ошибка при отправке запроса на добавление расхода ${type}:`, error);
        }
    }

    async handleProfitSubmit(e) {
        e.preventDefault();
        const dateInput = this.container.querySelector('#profitDate');
        const nameInput = this.container.querySelector('#profitName');
        const amountInput = this.container.querySelector('#profitAmount');

        if (!dateInput || !nameInput || !amountInput) {
            console.error('Не удалось найти все необходимые поля для доходов');
            return;
        }

        const date = dateInput.value;
        const name = nameInput.value;
        const sum = amountInput.value;

        if (!date || !name || !sum) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/month/profits/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date, name, sum }),
            });

            if (response.ok) {
                alert('Доход успешно добавлен');
                e.target.reset();
            } else {
                alert('Ошибка при добавлении дохода');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса на добавление дохода:', error);
        }
    }

    async handleDepositSubmit(e, type) {
        e.preventDefault();
        const dateInput = this.container.querySelector(`#deposit${type.charAt(0).toUpperCase() + type.slice(1)}Date`);
        const amountInput = this.container.querySelector(`#deposit${type.charAt(0).toUpperCase() + type.slice(1)}Amount`);

        if (!dateInput || !amountInput) {
            console.error(`Не удалось найти все необходимые поля для депозита типа ${type}`);
            return;
        }

        const date = dateInput.value;
        const sum = amountInput.value;

        if (!date || !sum) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/v1/deposits/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date, sum }),
            });

            if (response.ok) {
                alert(`Депозит успешно ${type === 'in' ? 'внесен' : 'списан'}`);
                e.target.reset();
            } else {
                alert(`Ошибка при ${type === 'in' ? 'внесении' : 'списании'} депозита`);
            }
        } catch (error) {
            console.error(`Ошибка при отправке запроса на ${type === 'in' ? 'внесение' : 'списание'} депозита:`, error);
        }
    }

    async handleTaxSubmit(e) {
        e.preventDefault();
        const dateInput = this.container.querySelector('#taxDate');
        const amountInput = this.container.querySelector('#taxAmount');

        if (!dateInput || !amountInput) {
            console.error('Не удалось найти все необходимые поля для налогов');
            return;
        }

        const date = dateInput.value;
        const sum = amountInput.value;

        if (!date || !sum) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/taxes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date, sum }),
            });

            if (response.ok) {
                alert('Налог успешно добавлен');
                e.target.reset();
            } else {
                alert('Ошибка при добавлении налога');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса на добавление налога:', error);
        }
    }
}
