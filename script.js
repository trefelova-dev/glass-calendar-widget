
document.addEventListener('DOMContentLoaded', () => {
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const monthNamesGenitive = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = new Date();

    const mockEvents = {};
    
    const generateMockEvents = () => {
        const eventTypes = [
            { title: "Встреча с командой", icon: "ph-users", color: "text-sky-400", bg: "bg-sky-400/10" },
            { title: "Дизайн ревью", icon: "ph-paint-brush", color: "text-purple-400", bg: "bg-purple-400/10" }
        ];

        for (let i = 0; i < 15; i++) {
            const rDay = Math.floor(Math.random() * 28) + 1;
            const rMonth = currentMonth;
            const key = `${currentYear}-${rMonth}-${rDay}`;
            if (!mockEvents[key]) mockEvents[key] = [];
            
            mockEvents[key].push({
                time: `10:00 - 11:00`,
                title: eventTypes[0].title,
                icon: eventTypes[0].icon,
                colorClass: eventTypes[0].color,
                bgClass: eventTypes[0].bg
            });
        }
    };
    generateMockEvents();

    const monthDisplay = document.getElementById('month-display');
    const yearDisplay = document.getElementById('year-display');
    const calendarGrid = document.getElementById('calendar-grid');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const eventsContainer = document.getElementById('events-container');

    const renderCalendar = (month, year) => {
        calendarGrid.innerHTML = '';
        monthDisplay.innerText = monthNames[month];
        yearDisplay.innerText = year;

        const firstDay = new Date(year, month, 1).getDay();
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

        for (let i = startDay - 1; i >= 0; i--) {
            const btn = document.createElement('button');
            btn.className = 'day-btn rounded-xl flex flex-col items-center justify-center text-white/20 text-sm font-medium h-10 sm:h-12 w-full cursor-not-allowed';
            btn.innerText = prevMonthDays - i;
            btn.disabled = true;
            calendarGrid.appendChild(btn);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const btn = document.createElement('button');
            btn.className = 'day-btn rounded-xl flex flex-col items-center justify-center text-white/80 text-sm font-medium h-10 sm:h-12 w-full';
            btn.innerText = i;
            
            const dateKey = `${year}-${month}-${i}`;
            
            if (isCurrentMonth && i === today.getDate()) {
                btn.classList.add('day-today', 'text-white');
            }

            if (selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                btn.classList.add('day-active');
            }

            if (mockEvents[dateKey] && mockEvents[dateKey].length > 0) {
                const indicatorWrapper = document.createElement('div');
                indicatorWrapper.className = 'event-indicator';
                const dotsCount = Math.min(mockEvents[dateKey].length, 3);
                for(let d = 0; d < dotsCount; d++) {
                    const dot = document.createElement('div');
                    dot.className = 'event-dot';
                    indicatorWrapper.appendChild(dot);
                }
                btn.appendChild(indicatorWrapper);
            }

            btn.addEventListener('click', () => {
                selectedDate = new Date(year, month, i);
                document.querySelectorAll('.day-active').forEach(el => el.classList.remove('day-active'));
                btn.classList.add('day-active');
                renderEvents();
            });

            btn.style.animation = `fadeEnter 0.3s ease forwards ${i * 0.01}s`;
            btn.style.opacity = '0';
            calendarGrid.appendChild(btn);
        }

        const totalCells = calendarGrid.children.length;
        for (let i = 1; i <= 42 - totalCells; i++) {
            const btn = document.createElement('button');
            btn.className = 'day-btn rounded-xl flex flex-col items-center justify-center text-white/20 text-sm font-medium h-10 sm:h-12 w-full cursor-not-allowed';
            btn.innerText = i;
            btn.disabled = true;
            calendarGrid.appendChild(btn);
        }
    };

    const renderEvents = () => {
        if (!selectedDate) return;
        const day = selectedDate.getDate();
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();
        
        selectedDateDisplay.innerText = `${day} ${monthNamesGenitive[month]}, ${year}`;
        eventsContainer.innerHTML = '';
        
        const dateKey = `${year}-${month}-${day}`;
        const dayEvents = mockEvents[dateKey];

        if (!dayEvents || dayEvents.length === 0) {
            eventsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-40 text-white/30 fade-enter">
                    <i class="ph ph-calendar-blank text-4xl mb-2"></i>
                    <p class="text-sm">Свободный день</p>
                </div>`;
            return;
        }

        dayEvents.forEach((evt, index) => {
            const eventEl = document.createElement('div');
            eventEl.className = `p-4 rounded-2xl ${evt.bgClass} border border-white/5 flex gap-4 items-center fade-enter`;
            eventEl.style.animationDelay = `${index * 0.05}s`;
            eventEl.style.opacity = '0';
            eventEl.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <i class="ph ${evt.icon} text-xl ${evt.colorClass}"></i>
                </div>
                <div class="flex-grow">
                    <h4 class="font-medium text-white text-sm sm:text-base">${evt.title}</h4>
                    <p class="text-xs text-white/50 flex items-center gap-1 mt-1">
                        <i class="ph ph-clock text-white/40"></i> ${evt.time}
                    </p>
                </div>
            `;
            eventsContainer.appendChild(eventEl);
        });
    };

    const modal = document.getElementById('event-modal');
    const overlay = document.getElementById('modal-overlay');
    const modalCard = document.getElementById('modal-card');
    const btnOpenModal = document.getElementById('btn-open-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const addEventForm = document.getElementById('add-event-form');

    const openModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            modalCard.classList.remove('opacity-0', 'translate-y-4');
        }, 10);
    };

    const closeModal = () => {
        overlay.classList.add('opacity-0');
        modalCard.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            addEventForm.reset();
        }, 300);
    };

    btnOpenModal.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('event-title').value;
        const time = document.getElementById('event-time').value;
        const type = document.getElementById('event-type').value;
        
        const typeStyles = {
            work: { icon: 'ph-briefcase', color: 'text-sky-400', bg: 'bg-sky-400/10' },
            call: { icon: 'ph-phone-call', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            personal: { icon: 'ph-person', color: 'text-purple-400', bg: 'bg-purple-400/10' }
        };
        const style = typeStyles[type];

        const day = selectedDate.getDate();
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();
        const dateKey = `${year}-${month}-${day}`;

        if (!mockEvents[dateKey]) mockEvents[dateKey] = [];
        
        mockEvents[dateKey].push({
            title: title,
            time: `${time} - ${parseInt(time.split(':')[0])+1}:00`,
            icon: style.icon,
            colorClass: style.color,
            bgClass: style.bg
        });

        closeModal();
        
        renderCalendar(currentMonth, currentYear);
        renderEvents();
    });

    document.getElementById('prev-month').addEventListener('click', () => { currentMonth--; if(currentMonth<0){currentMonth=11;currentYear--;} renderCalendar(currentMonth, currentYear); });
    document.getElementById('next-month').addEventListener('click', () => { currentMonth++; if(currentMonth>11){currentMonth=0;currentYear++;} renderCalendar(currentMonth, currentYear); });
    
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.documentElement.style.setProperty('--accent-color', e.target.getAttribute('data-color'));
            document.documentElement.style.setProperty('--accent-shadow', e.target.getAttribute('data-shadow'));
            themeBtns.forEach(b => { b.classList.remove('border-white'); b.classList.add('border-transparent'); });
            e.target.classList.remove('border-transparent'); e.target.classList.add('border-white');
        });
    });

    let isLightMode = false;
    document.getElementById('toggle-theme').addEventListener('click', (e) => {
        isLightMode = !isLightMode;
        document.body.classList.toggle('light-theme', isLightMode);
        e.currentTarget.innerHTML = isLightMode ? '<i class="ph ph-moon text-lg"></i>' : '<i class="ph ph-sun text-lg"></i>';
    });

    let is3DEnabled = true;
    const card = document.getElementById('calendar-card');
    const toggle3d = document.getElementById('toggle-3d');
    toggle3d.addEventListener('click', () => {
        is3DEnabled = !is3DEnabled;
        card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        toggle3d.classList.toggle('text-white/50'); toggle3d.classList.toggle('text-white/20');
    });

    document.addEventListener('mousemove', (e) => {
        if (!is3DEnabled) return;
        const xAxis = (window.innerWidth / 2 - e.pageX) / 120;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 120;
        card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    document.addEventListener('mouseleave', () => {
        if(is3DEnabled) card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
    });

    renderCalendar(currentMonth, currentYear);
    renderEvents();
});