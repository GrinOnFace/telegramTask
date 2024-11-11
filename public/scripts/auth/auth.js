import { API } from '../config/api.js';

export class Auth {
    constructor(container, onAuthStateChange) {
        this.container = container;
        this.onAuthStateChange = onAuthStateChange;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const authHTML = `
            <div class="auth-form">
                <h2>Вход в систему</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">Имя пользователя:</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль:</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="btn-login">Войти</button>
                </form>
            </div>
        `;
        this.container.innerHTML = authHTML;
        this.loginForm = this.container.querySelector('#login-form');
    }

    attachEventListeners() {
        this.loginForm.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const username = this.container.querySelector('#username').value;
        const password = this.container.querySelector('#password').value;
        
        try {
            const response = await API.login(username, password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isAuthenticated', 'true');
            this.onAuthStateChange(true);
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            alert(error.message || 'Неверное имя пользователя или пароль');
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        window.location.reload(); 
    }

    static isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('token');
    }
}
