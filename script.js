document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const eventModal = document.getElementById('eventModal');
    const addEventBtn = document.getElementById('addEventBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const cancelEventBtn = document.getElementById('cancelEventBtn');

    let events = [];
    let editingEvent = null;

    addEventBtn.addEventListener('click', () => {
        editingEvent = null;
        eventModal.classList.add('show');
    });

    cancelEventBtn.addEventListener('click', () => {
        eventModal.classList.remove('show');
    });

    saveEventBtn.addEventListener('click', () => {
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;

        if (eventName && eventDate) {
            if (editingEvent) {
                editingEvent.name = eventName;
                editingEvent.date = eventDate;
            } else {
                events.push({ name: eventName, date: eventDate });
            }
            renderEvents();
            eventModal.classList.remove('show');
        }
    });

    function renderEvents() {
        calendarElement.innerHTML = '';
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            calendarElement.appendChild(dayElement);
        });

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.textContent = event.name;
            eventElement.dataset.date = event.date;

            eventElement.addEventListener('click', () => {
                editingEvent = event;
                document.getElementById('eventName').value = event.name;
                document.getElementById('eventDate').value = event.date;
                eventModal.classList.add('show');
            });

            calendarElement.appendChild(eventElement);
        });
    }
});
