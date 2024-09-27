class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        this.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        this.calendarElement = document.getElementById('calendar');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.weekdaysElement = document.getElementById('weekdays');
        this.datesElement = document.getElementById('dates');

        this.selectedDateInfoElement = document.getElementById('selectedDateInfo');
        this.noteInputElement = document.createElement('input');
		this.noteInputElement.classList.add('note-input');
        this.noteInputElement.type = 'text';
        this.noteInputElement.placeholder = 'Введите заметку для выбранного дня';
        this.selectedDateInfoElement.appendChild(this.noteInputElement);
        
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
        
        this.render();
    }
    
    render() {
        this.renderCurrentMonth();
        this.renderWeekdays();
        this.renderDates();
		this.renderSelectedDateInfo();
    }
    
    renderSelectedDateInfo(){
		this.selectedDateInfoElement.textContent = 'День не выбран';
		this.noteInputElement.style.display = 'none'; 
	}
    
    renderCurrentMonth() {
        this.currentMonthElement.textContent = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }
    
    renderWeekdays() {
        this.weekdaysElement.innerHTML = '';
        this.weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            this.weekdaysElement.appendChild(dayElement);
        });
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

document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});

//TODO: 1) Ручка для добавления заметки 2) Ручка получения заметок по дате 3) Ручка редактирования заметок