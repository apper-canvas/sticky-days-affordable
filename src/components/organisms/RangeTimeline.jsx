import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';

const RangeTimeline = ({
  dateRange = null,
  timeSlots = [],
  tasks = [],
  getTasksForDate = () => [],
  getTasksForTimeSlot = () => [],
  handleDragOver = () => {},
  handleDrop = () => {},
  handleUpdateTask = () => {},
  handleDeleteTask = () => {},
  handleDragStart = () => {},
  draggedTask = null
}) => {
// Generate array of dates from range
  const getDatesInRange = () => {
    if (!dateRange?.start || !dateRange?.end) return [];
    
    try {
      const dates = [];
      const start = dateRange.start instanceof Date ? dateRange.start : new Date(dateRange.start);
      const end = dateRange.end instanceof Date ? dateRange.end : new Date(dateRange.end);
      
      // Validate dates
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return [];
      }
      
      // Prevent infinite loops by limiting range
      const maxDays = 365; // Maximum 1 year
      let dayCount = 0;
      
      let current = new Date(start);
      while (current <= end && dayCount < maxDays) {
        dates.push(new Date(current));
        current = addDays(current, 1);
        dayCount++;
      }
      
      return dates;
    } catch (error) {
      console.error('Error generating date range:', error);
      return [];
    }
  };

  const handleTaskDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = 'move';
    if (handleDragStart) {
      handleDragStart(task);
    }
  };

  const handleSlotDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (handleDragOver) {
      handleDragOver(e);
    }
};

  const handleSlotDrop = (e, date, timeSlot) => {
    e.preventDefault();
    if (handleDrop) {
      handleDrop(e, date, timeSlot);
    }
  };
  const TaskCard = ({ task, onEdit, onDelete }) => (
    <motion.div
      draggable
      onDragStart={(e) => handleTaskDragStart(e, task)}
      className={`
        p-2 rounded-lg shadow-sm border-l-4 cursor-move text-xs
        ${task.priority === 'high' ? 'border-red-400 bg-red-50' : 
          task.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
          'border-green-400 bg-green-50'}
        ${draggedTask?.id === task.id ? 'opacity-50' : ''}
        hover:shadow-md transition-shadow
      `}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
    >
      <div className="font-medium truncate">{task.title}</div>
      {task.description && (
        <div className="text-gray-600 truncate mt-1">{task.description}</div>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">{task.timeSlot}</span>
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700 text-xs ml-1"
            >
              ×
            </button>
          )}
        </div>
      </div>
</motion.div>
  );

  const dates = getDatesInRange();

  if (!dates.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-surface-500 text-lg font-medium mb-2">Invalid Date Range</div>
          <div className="text-surface-400 text-sm">Please select a valid date range to view the timeline</div>
        </div>
      </div>
    );
  }

  return (
<div className="flex-1 overflow-auto p-4">
      <div className="min-w-max">
        {/* Header with dates - positioned at top */}
        <div className="sticky top-0 bg-white z-10 mb-4 border-b border-surface-200 pb-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `120px repeat(${dates.length}, minmax(150px, 1fr))` }}>
            <div className="flex items-end pb-2">
              <span className="text-xs font-medium text-surface-500">Time</span>
            </div>
            {dates.map((date, index) => (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-3 bg-surface-50 rounded-lg border border-surface-100 min-w-[150px]"
              >
                <div className="font-semibold text-sm text-surface-700 mb-1">
                  {format(date, 'EEE')}
                </div>
                <div className={`text-xl font-bold mb-1 ${isSameDay(date, new Date()) ? 'text-primary' : 'text-surface-900'}`}>
                  {format(date, 'd')}
                </div>
                <div className="text-xs text-surface-500">
                  {format(date, 'MMM yyyy')}
                </div>
                {isSameDay(date, new Date()) && (
                  <div className="mt-1 w-2 h-2 bg-primary rounded-full mx-auto"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline grid */}
        <div className="space-y-2">
          {timeSlots.map((timeSlot, slotIndex) => (
            <motion.div
              key={timeSlot}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: slotIndex * 0.02 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `120px repeat(${dates.length}, minmax(150px, 1fr))` }}
            >
              {/* Time label */}
              <div className="flex items-center justify-end pr-4 py-2 text-sm font-medium text-surface-600 min-w-[120px]">
                {timeSlot}
              </div>

              {/* Date cells */}
              {dates.map((date) => {
                const dateTasks = getTasksForTimeSlot ? getTasksForTimeSlot(date, timeSlot) : [];
                
                return (
                  <div
                    key={`${date.toISOString()}-${timeSlot}`}
                    className="min-h-[80px] min-w-[150px] p-2 border border-surface-200 rounded-lg bg-white hover:bg-surface-50 transition-colors"
                    onDragOver={handleSlotDragOver}
                    onDrop={(e) => handleSlotDrop(e, date, timeSlot)}
                  >
                    <div className="space-y-1">
                      {dateTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleUpdateTask}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

RangeTimeline.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    type: PropTypes.string
  }),
  timeSlots: PropTypes.arrayOf(PropTypes.string),
  tasks: PropTypes.arrayOf(PropTypes.object),
  getTasksForDate: PropTypes.func,
  getTasksForTimeSlot: PropTypes.func,
  handleDragOver: PropTypes.func,
  handleDrop: PropTypes.func,
  handleUpdateTask: PropTypes.func,
  handleDeleteTask: PropTypes.func,
  handleDragStart: PropTypes.func,
  draggedTask: PropTypes.object
};


export default RangeTimeline;