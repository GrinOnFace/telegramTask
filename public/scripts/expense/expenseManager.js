import { API } from '../config/api.js';

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
        const formData = this.getFormData(type);
        
        if (!this.validateFormData(formData)) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await API.createExpense(type, formData);
            alert(`Расход ${type} успешно добавлен`);
            e.target.reset();
        } catch (error) {
            console.error(`Ошибка при добавлении расхода ${type}:`, error);
            alert(error.message || `Ошибка при добавлении расхода ${type}`);
        }
    }

    async handleProfitSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('profit');
        
        if (!this.validateFormData(formData)) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await API.createProfit(formData);
            alert('Доход успешно добавлен');
            e.target.reset();
        } catch (error) {
            console.error('Ошибка при добавлении дохода:', error);
            alert(error.message || 'Ошибка при добавлении дохода');
        }
    }

    async handleDepositSubmit(e, type) {
        e.preventDefault();
        const formData = this.getDepositFormData(type);
        
        if (!this.validateDepositFormData(formData)) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await API.createDeposit(type, formData);
            alert(`Депозит успешно ${type === 'in' ? 'внесен' : 'списан'}`);
            e.target.reset();
        } catch (error) {
            console.error(`Ошибка при ${type === 'in' ? 'внесении' : 'списании'} депозита:`, error);
            alert(error.message || `Ошибка при ${type === 'in' ? 'внесении' : 'списании'} депозита`);
        }
    }

    async handleTaxSubmit(e) {
        e.preventDefault();
        const formData = this.getTaxFormData();
        
        if (!this.validateTaxFormData(formData)) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await API.createTax(formData);
            alert('Налог успешно добавлен');
            e.target.reset();
        } catch (error) {
            console.error('Ошибка при добавлении налога:', error);
            alert(error.message || 'Ошибка при добавлении налога');
        }
    }

    getFormData(type) {
        return {
            date: this.container.querySelector(`#${type}Date`).value,
            name: this.container.querySelector(`#${type}Name`).value,
            sum: this.container.querySelector(`#${type}Amount`).value
        };
    }

    getDepositFormData(type) {
        const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
        return {
            date: this.container.querySelector(`#deposit${capitalizedType}Date`).value,
            sum: this.container.querySelector(`#deposit${capitalizedType}Amount`).value
        };
    }

    getTaxFormData() {
        return {
            date: this.container.querySelector('#taxDate').value,
            sum: this.container.querySelector('#taxAmount').value
        };
    }

    validateFormData(data) {
        return data.date && data.name && data.sum;
    }

    validateDepositFormData(data) {
        return data.date && data.sum;
    }

    validateTaxFormData(data) {
        return data.date && data.sum;
    }
}
