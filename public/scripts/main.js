import { Calendar } from './calendar/calendar.js';
import { EventManager } from './events/eventManager.js';
import { EventList } from './events/eventList.js';
import { ClientList } from './clients/clientList.js';
import { Auth } from './auth/auth.js';
import { ExpenseManager } from './expense/expenseManager.js';
import { ExpenseList } from './expense/expenseList.js';
import { EarningTable } from './earning/earningTable.js';
import { SummaryTable } from './summary/summaryTable.js';

const root = document.getElementById('app');
const menuContainer = document.createElement('aside');
menuContainer.classList.add('menu-container');
const pageContainer = document.createElement('main');
pageContainer.classList.add('page-container');
root.appendChild(menuContainer);
root.appendChild(pageContainer);

const config = {
    menu: {
        calendar: {
            id: 'calendar',
            text: 'Календарь',
        },
        eventManager: {
            id: 'event-manager',
            text: 'Менеджер мероприятий',
        },
		eventList: {
			id: 'event-list',
			text: 'Список мероприятий',
		},
		clientList: {
			id: 'client-list',
			text: 'Список клиентов',
		},
        expenseManager: {
            id: 'expense-manager',
            text: 'Доходы и расходы',
        },
        expenseList: {
            id: 'expense-list',
            text: 'Список доходов и расходов',
        },
		earningTable: {
			id: 'earning-table',
			text: 'Сводная таблица',
		},
		summaryTable: {
			id: 'summary-table',
			text: 'Годовая таблица',
		},
    },
};

Object.entries(config.menu).forEach(([key, { id, text }]) => {
    const menuElement = document.createElement('a');
    menuElement.href = '#';
    menuElement.textContent = text;
    menuElement.dataset.section = id;

    menuContainer.appendChild(menuElement);
});

function renderContent(sectionId) {
    pageContainer.innerHTML = '';

    if (!Auth.isAuthenticated() && sectionId !== 'login') {
        sectionId = 'login';
    }

    switch(sectionId) {
        case 'calendar': {
            const calendarContainer = document.createElement('div');
            calendarContainer.id = 'calendar-container';
            pageContainer.appendChild(calendarContainer);
            new Calendar(calendarContainer);
            break;
        }
        case 'event-manager': {
            const eventManagerContainer = document.createElement('div');
            eventManagerContainer.id = 'event-manager-container';
            pageContainer.appendChild(eventManagerContainer);
            new EventManager(eventManagerContainer);
            break;
        }
		case 'event-list': {
			const eventListContainer = document.createElement('div');
			eventListContainer.id = 'event-list-container';
			pageContainer.appendChild(eventListContainer);
			new EventList(eventListContainer);
			break;
		}
		case 'client-list': {
			const clientListContainer = document.createElement('div');
			clientListContainer.id = 'client-list-container';
			pageContainer.appendChild(clientListContainer);
			new ClientList(clientListContainer);
			break;
		}
		case 'expense-manager': {
			const expenseManagerContainer = document.createElement('div');
			expenseManagerContainer.id = 'expense-manager-container';
			pageContainer.appendChild(expenseManagerContainer);
			new ExpenseManager(expenseManagerContainer);
			break;
		}
		case 'expense-list': {
			const expenseListContainer = document.createElement('div');
			expenseListContainer.id = 'expense-list-container';
			pageContainer.appendChild(expenseListContainer);
			new ExpenseList(expenseListContainer);
			break;
		}
		case 'earning-table': {
			const earningTableContainer = document.createElement('div');
			earningTableContainer.id = 'earning-table-container';
			pageContainer.appendChild(earningTableContainer);
			new EarningTable(earningTableContainer);
			break;
		}
		case 'summary-table': {
			const summaryTableContainer = document.createElement('div');
			summaryTableContainer.id = 'summary-table-container';
			pageContainer.appendChild(summaryTableContainer);
			new SummaryTable(summaryTableContainer);
			break;
		}
		case 'login': {
			const authContainer = document.createElement('div');
			authContainer.id = 'auth-container';
			pageContainer.appendChild(authContainer);
			new Auth(authContainer, onAuthStateChange);
			break;
		}
        default:
            pageContainer.innerHTML = '<h1>404</h1><p>Страница не найдена</p>';
    }
}

function onAuthStateChange(isAuthenticated) {
    if (isAuthenticated) {
        menuContainer.style.display = 'block';
        renderContent('event-list');
    } else {
        menuContainer.style.display = 'none';
        renderContent('login');
    }
}

document.querySelectorAll('.menu-container a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = event.target.dataset.section;
        renderContent(sectionId);
    });
});

window.addEventListener('load', () => {
    menuContainer.style.display = 'none';
    if (Auth.isAuthenticated()) {
        onAuthStateChange(true);
    } else {
        renderContent('login');
    }
});
