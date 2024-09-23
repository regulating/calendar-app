document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const eventModal = document.getElementById('eventModal');
    const addEventBtn = document.getElementById('addEventBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    const themeToggle = document.getElementById('themeToggle');

    let events = JSON.parse(localStorage.getItem('events')) || [];
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
                const index = events.findIndex(event => event === editingEvent);
                events[index].name = eventName;
                events[index].date = eventDate;
            } else {
                events.push({ name: eventName, date: eventDate });
            }
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents();
            eventModal.classList.remove('show');
        }
    });

    deleteEventBtn.addEventListener('click', () => {
        const index = events.findIndex(event => event === editingEvent);
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents();
        eventModal.classList.remove('show');
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    function renderEvents() {
        calendarElement.innerHTML = '';
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            dayElement.draggable = true;

            dayElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', day);
            });

            dayElement.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            dayElement.addEventListener('drop', (e) => {
                const draggedDay = e.dataTransfer.getData('text');
                alert(`Dragged from ${draggedDay} to ${day}`);
            });

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

    renderEvents();
});

