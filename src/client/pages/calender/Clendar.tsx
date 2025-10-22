import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface CalendarEvent {
  id: string;
  time: string;
  vehicle: string;
  customer: string;
  type: 'pickup' | 'return';
}

interface DaySchedule {
  date: string;
  day: string;
  events: CalendarEvent[];
}

interface CalendarData {
  month: string;
  year: string;
  schedules: DaySchedule[];
}


export const mockCalendarData: CalendarData = {
  month: 'August',
  year: '2028',
  schedules: [
    {
      date: '14',
      day: 'Mon',
      events: [
        { id: '1', time: '8:00 AM', vehicle: 'Ford Focus', customer: 'Michael Brown', type: 'pickup' },
        { id: '2', time: '9:00 AM', vehicle: 'Toyota Corolla', customer: 'Alice Johnson', type: 'pickup' }
      ]
    },
    {
      date: '15',
      day: 'Tue',
      events: [
        { id: '3', time: '8:00 AM', vehicle: 'Kia Soul', customer: 'Oliver Scott', type: 'pickup' },
        { id: '4', time: '9:00 AM', vehicle: 'Toyota Corolla', customer: 'Alice Johnson', type: 'pickup' },
        { id: '5', time: '9:00 AM', vehicle: 'Nissan Altima', customer: 'Oliver Scott', type: 'return' }
      ]
    },
    {
      date: '16',
      day: 'Wed',
      events: [
        { id: '6', time: '8:00 AM', vehicle: 'Chevrolet Malibu', customer: 'Helen Martinez', type: 'pickup' },
        { id: '7', time: '1:00 PM', vehicle: 'Hyundai Elantra', customer: 'Jane Wilson', type: 'pickup' },
        { id: '8', time: '1:20 PM', vehicle: 'Mercedes C-Class', customer: 'Fiona Brown', type: 'pickup' },
        { id: '9', time: '1:20 PM', vehicle: 'Hyundai Elantra', customer: 'George Clark', type: 'return' }
      ]
    },
    {
      date: '17',
      day: 'Thu',
      events: [
        { id: '10', time: '1:20 PM', vehicle: 'Ford Focus', customer: 'Kyle Thompson', type: 'pickup' },
        { id: '11', time: '1:20 PM', vehicle: 'Honda Civic', customer: 'Bob Smith', type: 'return' },
        { id: '12', time: '11:00 AM', vehicle: 'BMW X5', customer: 'Charlie Davis', type: 'pickup' }
      ]
    },
    {
      date: '18',
      day: 'Fri',
      events: [
        { id: '13', time: '8:00 AM', vehicle: 'Chariot MaliBlu', customer: 'Nancy Davis', type: 'pickup' },
        { id: '14', time: '8:00 AM', vehicle: 'BMW X5', customer: 'Charlie Davis', type: 'return' }
      ]
    },
    {
      date: '19',
      day: 'Sat',
      events: [
        { id: '15', time: '8:00 PM', vehicle: 'Ford Focus', customer: 'Mike Thompson', type: 'pickup' },
        { id: '16', time: '3:00 PM', vehicle: 'Ford Focus', customer: 'Kyle Thompson', type: 'return' },
        { id: '17', time: '4:00 PM', vehicle: 'Ford Focus', customer: 'Kyle Thompson', type: 'pickup' },
        { id: '18', time: '5:00 PM', vehicle: 'Ford Focus', customer: 'Kyle Thompson', type: 'return' },
        { id: '19', time: '2:00 PM', vehicle: 'Honda Civic', customer: 'Bob Smith', type: 'pickup' },
        { id: '20', time: '1:50 AM', vehicle: 'Toyota Corolla', customer: 'Michael Brown', type: 'return' },
        { id: '21', time: '2:50 PM', vehicle: 'Audi Q7', customer: 'Kyle Thompson', type: 'pickup' },
        { id: '22', time: '3:00 PM', vehicle: 'Kia Soul', customer: 'Diana White', type: 'return' }
      ]
    }
  ]
};


const fetchCalendarData = async (): Promise<CalendarData> => {
  const response = await fetch('http://localhost:3000/calendar');
  if (!response.ok) {
    throw new Error('Failed to fetch calendar data');
  }
  return response.json();
};
const CalendarSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 animate-pulse">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white">
              <div className="p-3 border-b border-gray-100">
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-8"></div>
                  <div className="h-6 bg-gray-200 rounded mx-auto w-6"></div>
                </div>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="p-2 rounded-lg bg-gray-100 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export const Calendar: React.FC = () => {
  const { data: calendarData, isLoading, error } = useQuery({
    queryKey: ['calendar-data'],
    queryFn: fetchCalendarData
  });

  if (isLoading) return <CalendarSkeleton />;
  if (error) return <div className="p-6 text-red-500">Error loading calendar data</div>;
  if (!calendarData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {calendarData.month} {calendarData.year}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Pickup</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Return</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            UTC +1
          </div>
        </div>

      
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarData.schedules.map((daySchedule) => (
            <div key={daySchedule.date} className="bg-white">
              
              <div className="p-3 border-b border-gray-100">
                <div className="text-center">
                  <div className="text-sm text-gray-500 font-medium">{daySchedule.day}</div>
                  <div className="text-lg font-semibold text-gray-900">{daySchedule.date}</div>
                </div>
              </div>

            
              <div className="p-2 space-y-2 min-h-[200px]">
                {daySchedule.events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-lg border-l-4 ${
                      event.type === 'pickup' 
                        ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                        : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                    } transition-colors cursor-pointer`}
                  >
                    <div className="text-xs font-medium text-gray-900 mb-1">
                      {event.time}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {event.vehicle}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {event.customer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};