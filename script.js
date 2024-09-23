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
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
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
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentYear, currentMonth, currentDate.getDate() - currentDate.getDay() + i);
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = `${days[i]} ${date.getDate()}`;
            dayElement.draggable = true;
    
            dayElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', date.toISOString().split('T')[0]);
            });
    
            dayElement.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
    
            dayElement.addEventListener('drop', (e) => {
                const draggedDate = e.dataTransfer.getData('text');
                alert(`Dragged from ${draggedDate} to ${date.toISOString().split('T')[0]}`);
            });
    
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getDate() === date.getDate() &&
                       eventDate.getMonth() === date.getMonth() &&
                       eventDate.getFullYear() === date.getFullYear();
            });
    
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = event.name;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    editingEvent = event;
                    document.getElementById('eventName').value = event.name;
                    document.getElementById('eventDate').value = event.date;
                    eventModal.classList.add('show');
                });

                eventElement.appendChild(editButton);
                dayElement.appendChild(eventElement);
            });
    
            calendarElement.appendChild(dayElement);
        }
    }

    renderEvents();
});
