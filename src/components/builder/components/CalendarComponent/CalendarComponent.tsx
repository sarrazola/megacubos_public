import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface Event {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
}

interface CalendarComponentProps {
  events?: Event[];
  onEventAdd?: (event: Omit<Event, 'id'>) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarComponent: React.FC<CalendarComponentProps> = ({ events = [], onEventAdd }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date()
  });

  // Convert string dates to Date objects when component mounts
  const parsedEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }));

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));

  const handleTimeClick = (hour: number) => {
    const start = new Date(selectedDate.setHours(hour, 0, 0, 0));
    const end = new Date(selectedDate.setHours(hour + 1, 0, 0, 0));
    setNewEvent({ title: '', start, end });
    setIsAddingEvent(true);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEventAdd) {
      const eventToAdd = {
        title: newEvent.title,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end)
      };
      onEventAdd(eventToAdd);
    }
    setIsAddingEvent(false);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date()
    });
  };

  const getEventsForHour = (hour: number) => {
    return parsedEvents.filter(event => {
      const eventDate = new Date(event.start);
      const eventHour = eventDate.getHours();
      return eventHour === hour && isSameDay(eventDate, selectedDate);
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={handlePrevDay} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        <button onClick={handleNextDay} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="flex border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => handleTimeClick(hour)}
          >
            <div className="w-20 p-2 text-right text-gray-500 border-r">
              {format(new Date().setHours(hour), 'h a')}
            </div>
            <div className="flex-1 min-h-[60px] p-2 relative">
              {getEventsForHour(hour).map((event) => (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 bg-blue-100 text-blue-700 rounded p-1 text-sm"
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isAddingEvent && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleEventSubmit} className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={format(newEvent.start, 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newStart = new Date(newEvent.start.setHours(parseInt(hours), parseInt(minutes)));
                      setNewEvent({ ...newEvent, start: newStart });
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={format(newEvent.end, 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newEnd = new Date(newEvent.end.setHours(parseInt(hours), parseInt(minutes)));
                      setNewEvent({ ...newEvent, end: newEnd });
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;