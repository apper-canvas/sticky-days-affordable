import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const CalendarDayCell = ({ date, dayTasks, isCurrentMonth, isTodayDate, onClick, index }) => {
  return (
    <motion.div
      key={date.toISOString()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => onClick(date)}
      className={`
        aspect-square p-3 rounded-lg border-2 cursor-pointer transition-all
        hover:scale-105 hover:shadow-sticky-hover
        ${isTodayDate 
          ? 'border-primary bg-primary/5 shadow-sticky' 
          : 'border-surface-200 bg-white hover:border-surface-300'
        }
        ${!isCurrentMonth ? 'opacity-40' : ''}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Date Number */}
        <div className={`text-sm font-medium mb-2 ${
          isTodayDate ? 'text-primary' : 'text-surface-900'
        }`}>
          {format(date, 'd')}
        </div>

        {/* Task Indicators */}
        <div className="flex-1 space-y-1 overflow-hidden">
          {dayTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className={`h-2 rounded-full text-xs ${
                task.color === 'yellow' ? 'bg-stickyNote-yellow' :
                task.color === 'pink' ? 'bg-stickyNote-pink' :
                task.color === 'green' ? 'bg-stickyNote-green' :
                task.color === 'blue' ? 'bg-stickyNote-blue' :
                task.color === 'orange' ? 'bg-stickyNote-orange' :
                task.color === 'purple' ? 'bg-stickyNote-purple' :
                task.color === 'teal' ? 'bg-stickyNote-teal' :
                'bg-stickyNote-lime'
              }`}
            />
          ))}
          
          {dayTasks.length > 3 && (
            <div className="text-xs text-surface-500 font-medium">
              +{dayTasks.length - 3} more
            </div>
          )}
        </div>

        {/* Task Count */}
        {dayTasks.length > 0 && (
          <div className="mt-1 text-xs text-surface-600 font-medium">
            {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarDayCell;