document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const eventModal = document.getElementById('eventModal');
    const addEventBtn = document.getElementById('addEventBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    const themeToggle = document.getElementById('themeToggle');

    let events = JSON.parse(localStorage.getItem('events')) || [];
    let editingEvent = null;

    // Variables for current month and year
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    addEventBtn.addEventListener('click', () => {
        editingEvent = null;
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        eventModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    cancelEventBtn.addEventListener('click', () => {
        eventModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    saveEventBtn.addEventListener('click', () => {
        const eventName = document.getElementById('eventName').value.trim();
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
            document.body.style.overflow = 'auto'; // Restore scrolling
        } else {
            alert('Please enter both event name and date.');
        }
    });

    deleteEventBtn.addEventListener('click', () => {
        if (editingEvent) {
            const index = events.findIndex(event => event === editingEvent);
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents();
            eventModal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    // Navigation Buttons
    const prevMonthBtn = document.createElement('button');
    prevMonthBtn.textContent = '◀';
    prevMonthBtn.id = 'prevMonth';
    prevMonthBtn.title = 'Previous Month';
    prevMonthBtn.style.marginRight = '10px';

    const nextMonthBtn = document.createElement('button');
    nextMonthBtn.textContent = '▶';
    nextMonthBtn.id = 'nextMonth';
    nextMonthBtn.title = 'Next Month';

    const monthYearDisplay = document.createElement('span');
    monthYearDisplay.id = 'monthYear';
    monthYearDisplay.style.fontSize = '1.2em';
    monthYearDisplay.style.margin = '0 10px';

    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'center';
    navContainer.style.alignItems = 'center';
    navContainer.style.marginBottom = '20px';

    navContainer.appendChild(prevMonthBtn);
    navContainer.appendChild(monthYearDisplay);
    navContainer.appendChild(nextMonthBtn);

    // Insert navigation above the calendar
    const appContainer = document.getElementById('app');
    appContainer.insertBefore(navContainer, calendarElement);

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderEvents();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderEvents();
    });

    function renderEvents() {
        calendarElement.innerHTML = '';
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const firstDayIndex = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();

        // Update month and year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Render days of the week headers
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarElement.appendChild(dayHeader);
        });

        // Calculate total cells needed (including previous month's padding)
        const totalCells = Math.ceil((firstDayIndex + totalDays) / 7) * 7;

        for (let i = 0; i < totalCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';

            const dayNumber = i - firstDayIndex + 1;

            if (i >= firstDayIndex && dayNumber <= totalDays) {
                const date = new Date(currentYear, currentMonth, dayNumber);
                dayElement.textContent = dayNumber;

                // Check if there are events for this day
                const formattedDate = date.toISOString().split('T')[0];
                const dayEvents = events.filter(event => event.date === formattedDate);

                if (dayEvents.length > 0) {
                    const eventIndicator = document.createElement('div');
                    eventIndicator.className = 'event-indicator';
                    eventIndicator.title = `${dayEvents.length} event(s)`;

                    dayEvents.forEach(event => {
                        const eventBadge = document.createElement('div');
                        eventBadge.className = 'event-badge';
                        eventBadge.textContent = event.name;
                        eventBadge.addEventListener('click', (e) => {
                            e.stopPropagation();
                            editingEvent = event;
                            document.getElementById('eventName').value = event.name;
                            document.getElementById('eventDate').value = event.date;
                            eventModal.classList.add('show');
                            document.body.style.overflow = 'hidden'; // Prevent background scrolling
                        });
                        eventIndicator.appendChild(eventBadge);
                    });

                    dayElement.appendChild(eventIndicator);
                }

                // Drag and Drop Functionality (Optional)
                dayElement.draggable = true;

                dayElement.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text', date.toISOString().split('T')[0]);
                });

                dayElement.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dayElement.classList.add('dragover');
                });

                dayElement.addEventListener('dragleave', () => {
                    dayElement.classList.remove('dragover');
                });

                dayElement.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dayElement.classList.remove('dragover');
                    const draggedDate = e.dataTransfer.getData('text');
                    const droppedDate = date.toISOString().split('T')[0];
                    alert(`Dragged from ${draggedDate} to ${droppedDate}`);
                });

            } else {
                dayElement.classList.add('inactive-day');
            }

            calendarElement.appendChild(dayElement);
        }
    }

    renderEvents();
});
