import { Calendar } from './calendar.js';
import { EventManager } from './meroManager.js';
import { ClientManager } from './clientManager.js';

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
        clientManager: {
            id: 'client-manager',
            text: 'Менеджер клиентов',
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
        case 'client-manager': {
            const clientManagerContainer = document.createElement('div');
            clientManagerContainer.id = 'client-manager-container';
            pageContainer.appendChild(clientManagerContainer);
            new ClientManager(clientManagerContainer);
            break;
        }
        default:
            pageContainer.innerHTML = '<h1>404</h1><p>Страница не найдена</p>';
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
    renderContent('calendar');
});
