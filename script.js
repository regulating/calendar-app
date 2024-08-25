document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const eventModal = document.getElementById('eventModal');
    const addEventBtn = document.getElementById('addEventBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const cancelEventBtn = document.getElementById('cancelEventBtn');

    addEventBtn.addEventListener('click', () => {
        eventModal.classList.add('show');
    });

    cancelEventBtn.addEventListener('click', () => {
        eventModal.classList.remove('show');
    });

    saveEventBtn.addEventListener('click', () => {
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;

        if (eventName && eventDate) {
            alert(`Event "${eventName}" saved for ${eventDate}`);
            eventModal.classList.remove('show');
        }
    });

    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    });
});
