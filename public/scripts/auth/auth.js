import config from '../config.js';

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

    handleSubmit(e) {
        e.preventDefault();
        const username = this.container.querySelector('#username').value;
        const password = this.container.querySelector('#password').value;
        
        if (username === config.auth.username && password === config.auth.password) {
            localStorage.setItem('isAuthenticated', 'true');
            this.onAuthStateChange(true);
        } else {
            alert('Неверное имя пользователя или пароль');
        }
    }

    static logout() {
        localStorage.removeItem('isAuthenticated');
        this.onAuthStateChange(false);
    }

    static isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
}
