export class API {
    static BASE_URL = 'http://localhost:3000/api/v1';
    
    static async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const url = `${this.BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error('Произошла ошибка при выполнении запроса');
            }

            if (response.status === 204) {
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async login(username, password) {
        return this.request('/auth', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    static async getEvents(year, month) {
        return this.request(`/month/events/${year}/${month}`);
    }

	static async downloadClients(eventId) {
        return this.request(`/events/${eventId}/clients/download`);
    }

    static async createEvent(eventData) {
        return this.request('/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }

    static async deleteEvent(id) {
        return this.request(`/month/events/${id}`, {
            method: 'DELETE'
        });
    }

    static async getExpenses(type, year, month) {
        return this.request(`/month/expenses/${type}/${year}/${month}`);
    }

    static async createExpense(type, expenseData) {
        return this.request(`/month/expenses/${type}`, {
            method: 'POST',
            body: JSON.stringify(expenseData)
        });
    }

    static async deleteExpense(type, id) {
        return this.request(`/month/expenses/${type}/${id}`, {
            method: 'DELETE'
        });
    }

    static async getProfits(year, month) {
        return this.request(`/month/profits/${year}/${month}`);
    }

    static async createProfit(profitData) {
        return this.request('/month/profits', {
            method: 'POST',
            body: JSON.stringify(profitData)
        });
    }

    static async deleteProfit(id) {
        return this.request(`/month/profits/${id}`, {
            method: 'DELETE'
        });
    }

    static async getDeposits(type, year, month) {
        return this.request(`/deposits/${type}/${year}/${month}`);
    }

    static async createDeposit(type, depositData) {
        return this.request(`/deposits/${type}`, {
            method: 'POST',
            body: JSON.stringify(depositData)
        });
    }

    static async deleteDeposit(type, year, month) {
        return this.request(`/deposits/${type}/${year}/${month}`, {
            method: 'DELETE'
        });
    }

    static async getTaxes(year, month) {
        return this.request(`/taxes/${year}/${month}`);
    }

    static async createTax(taxData) {
        return this.request('/taxes', {
            method: 'POST',
            body: JSON.stringify(taxData)
        });
    }

    static async deleteTax(year, month) {
        return this.request(`/taxes/${year}/${month}`, {
            method: 'DELETE'
        });
    }

    static async getSocialStats(socnet, year, month) {
        return this.request(`/social_stats/${socnet}/${year}/${month}`);
    }

    static async createSocialStat(socnet, statData) {
        return this.request(`/social_stats/${socnet}`, {
            method: 'POST',
            body: JSON.stringify(statData)
        });
    }

    static async deleteSocialStat(socnet, id) {
        return this.request(`/social_stats/${socnet}/${id}`, {
            method: 'DELETE'
        });
    }

    static async getEarningTable(year, month) {
        return this.request(`/earning/${year}/${month}`);
    }

    static async getSummaryTable(year) {
        return this.request(`/summary/${year}`);
    }

    static async getEvents() {
        return this.request('/events');
    }

    static async deleteEvent(eventId) {
        return this.request(`/events/${eventId}`, {
            method: 'DELETE'
        });
    }

    static async addClientToEvent(eventId, clientData) {
        return this.request(`/events/${eventId}/clients`, {
            method: 'POST',
            body: JSON.stringify(clientData)
        });
    }

    static async addExpenseToEvent(eventId, expenseData) {
        return this.request(`/events/${eventId}/expenses`, {
            method: 'POST',
            body: JSON.stringify(expenseData)
        });
    }

    static async getClientData(clientId) {
        return this.request(`/clients/${clientId}`);
    }

    static async getClients() {
        return this.request('/clients');
    }

    static async deleteClient(clientId) {
        return this.request(`/clients/${clientId}`, {
            method: 'DELETE'
        });
    }

    static async updateClient(eventId, clientId, updateData) {
        return this.request(`/events/${eventId}/clients/${clientId}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }
} 