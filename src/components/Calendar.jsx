import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.css';

export default function Calendar({ events, onDateClick, onEventClick }) {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: `${event.person} (${event.fach})`,
      start: event.datum,
      allDay: false,
      extendedProps: {
        ...event
      }
    }));
    setCalendarEvents(formattedEvents);
  }, [events]);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height="auto"
        events={calendarEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        locale="de"
        firstDay={1} // Monday
        slotDuration="00:30:00"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        dateClick={(info) => onDateClick(info.date)}
        eventClick={(info) => onEventClick(info.event)}
      />
    </div>
  );
}
