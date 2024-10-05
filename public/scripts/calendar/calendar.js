export class Calendar {
    constructor(container) {
        this.container = container;
        this.currentDate = new Date();
        this.weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        this.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        this.createCalendarStructure();
        this.addEventListeners();
        this.render();
    }

    createCalendarStructure() {
        const calendarHTML = `
            <div class="calendar">
                <div class="calendar-header">
                    <button id="prevMonth">&lt;</button>
                    <h2 id="currentMonth"></h2>
                    <button id="nextMonth">&gt;</button>
                </div>
                <div id="weekdays" class="weekdays"></div>
                <div id="dates" class="dates"></div>
                <div id="selectedDateInfo" class="selected-date-info"></div>
            </div>
        `;
        this.container.innerHTML = calendarHTML;

        this.calendarElement = this.container.querySelector('.calendar');
        this.currentMonthElement = this.container.querySelector('#currentMonth');
        this.weekdaysElement = this.container.querySelector('#weekdays');
        this.datesElement = this.container.querySelector('#dates');
        this.selectedDateInfoElement = this.container.querySelector('#selectedDateInfo');

        this.noteInputElement = document.createElement('input');
        this.noteInputElement.classList.add('note-input');
        this.noteInputElement.type = 'text';
        this.noteInputElement.placeholder = 'Введите заметку для выбранного дня';
    }

    addEventListeners() {
        this.container.querySelector('#prevMonth').addEventListener('click', () => this.changeMonth(-1));
        this.container.querySelector('#nextMonth').addEventListener('click', () => this.changeMonth(1));
    }

    render() {
        this.renderCurrentMonth();
        this.renderWeekdays();
        this.renderDates();
        this.renderSelectedDateInfo();
    }

    renderSelectedDateInfo() {
        this.selectedDateInfoElement.textContent = 'День не выбран';
        this.noteInputElement.style.display = 'none';
    }

    renderCurrentMonth() {
        this.currentMonthElement.textContent = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderWeekdays() {
        this.weekdaysElement.innerHTML = this.weekdays.map(day => `<div>${day}</div>`).join('');
    }

    renderDates() {
        this.datesElement.innerHTML = '';
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

        let firstDayIndex = firstDay.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;

        for (let i = 0; i < firstDayIndex; i++) {
            this.datesElement.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateElement = document.createElement('div');
            dateElement.textContent = i;
            dateElement.classList.add('date');

            if (this.isToday(i)) {
                dateElement.classList.add('today');
            }

            dateElement.addEventListener('click', () => this.selectDate(i));

            this.datesElement.appendChild(dateElement);
        }
    }

    isToday(day) {
        const today = new Date();
        return day === today.getDate() &&
               this.currentDate.getMonth() === today.getMonth() &&
               this.currentDate.getFullYear() === today.getFullYear();
    }

    selectDate(day) {
        const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString('ru-RU', options);
        this.selectedDateInfoElement.innerHTML = `Выбранная дата: ${formattedDate}<br>`;

        this.selectedDateInfoElement.appendChild(this.noteInputElement);
        this.noteInputElement.value = '';
        this.noteInputElement.style.display = 'block';
        this.noteInputElement.focus();
    }

    changeMonth(change) {
        this.currentDate.setMonth(this.currentDate.getMonth() + change);
        this.render();
    }
}
