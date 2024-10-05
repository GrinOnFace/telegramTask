import { Calendar } from './calendar/calendar.js';
import { EventManager } from './events/eventManager.js';
// import { EventList } from './events/eventList.js';
import { ClientManager } from './clients/clientManager.js';
// import { ClientList } from './clients/clientList.js';
import { Auth } from './auth/auth.js';

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
        clientManager: {
            id: 'client-manager',
            text: 'Менеджер клиентов',
        },
		clientList: {
			id: 'client-list',
			text: 'Список клиентов',
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
		// case 'event-list': {
		// 	const eventListContainer = document.createElement('div');
		// 	eventListContainer.id = 'event-list-container';
		// 	pageContainer.appendChild(eventListContainer);
		// 	new EventList(eventListContainer);
		// 	break;
		// }
        case 'client-manager': {
            const clientManagerContainer = document.createElement('div');
            clientManagerContainer.id = 'client-manager-container';
            pageContainer.appendChild(clientManagerContainer);
            new ClientManager(clientManagerContainer);
            break;
        }
		// case 'client-list': {
		// 	const clientListContainer = document.createElement('div');
		// 	clientListContainer.id = 'client-list-container';
		// 	pageContainer.appendChild(clientListContainer);
		// 	new ClientList(clientListContainer);
		// 	break;
		// }
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
        renderContent('calendar');
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
