'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, CalendarDays } from 'lucide-react';
import { EventModal } from '@/components/EventModal';
import { CalendarEvent } from '@/lib/supabase';

// Import react-big-calendar CSS
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-styles.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/calendar/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    resource: event,
  }));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedEvent(null);
    setSelectedDate(start);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (calEvent: { id: string; resource: CalendarEvent }) => {
    setSelectedEvent(calEvent.resource);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      if (selectedEvent) {
        // Update existing event
        const response = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to update event');
      } else {
        // Create new event
        const response = await fetch('/api/calendar/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to create event');
      }
      await fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const eventStyleGetter = (event: { resource: CalendarEvent }) => {
    const color = event.resource.color || '#0066ff';
    return {
      style: {
        backgroundColor: color,
        borderRadius: '6px',
        border: 'none',
        boxShadow: `0 2px 8px ${color}40`,
      } as React.CSSProperties,
    };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0066ff] to-[#00ffff] rounded-xl flex items-center justify-center shadow-lg shadow-[#0066ff]/30">
            <CalendarDays className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Mission Calendar
            </h1>
            <p className="text-sm text-[#8a8a95]">
              Schedule and track your events
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setSelectedDate(new Date());
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00ffff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#0066ff]/30"
        >
          <Plus size={18} />
          New Event
        </button>
      </div>

      {/* Calendar */}
      <div className="flex-1 min-h-0">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          popup
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          timeslots={1}
          step={60}
          tooltipAccessor={(event) => event.resource?.description || event.title}
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        initialDate={selectedDate}
      />
    </div>
  );
}
