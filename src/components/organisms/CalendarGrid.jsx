import React from 'react';
import { isSameMonth, isToday } from 'date-fns';
import CalendarDayCell from '@/components/molecules/CalendarDayCell';

const CalendarGrid = ({ currentMonth, calendarDays, weekDays, getTasksForDate, handleDateClick }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-surface-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrent = isSameMonth(date, currentMonth);
            const isTodayDate = isToday(date);
            
            return (
              <CalendarDayCell
                key={date.toISOString()}
                date={date}
                dayTasks={dayTasks}
                isCurrentMonth={isCurrent}
                isTodayDate={isTodayDate}
                onClick={handleDateClick}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;