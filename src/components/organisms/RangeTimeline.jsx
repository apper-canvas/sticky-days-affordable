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
    
    const dates = [];
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    
    for (let current = start; current <= end; current = addDays(current, 1)) {
      dates.push(new Date(current));
    }
    
    return dates;
  };

  const dates = getDatesInRange();

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

  if (!dates.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Invalid date range</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="min-w-full">
        {/* Header with dates */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `120px repeat(${dates.length}, minmax(150px, 1fr))` }}>
          <div></div> {/* Empty cell for time labels */}
          {dates.map((date, index) => (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-2 bg-surface-50 rounded-lg"
            >
              <div className="font-semibold text-sm">
                {format(date, 'EEE')}
              </div>
              <div className={`text-lg ${isSameDay(date, new Date()) ? 'text-primary font-bold' : ''}`}>
                {format(date, 'd')}
              </div>
              <div className="text-xs text-gray-500">
                {format(date, 'MMM')}
              </div>
            </motion.div>
          ))}
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
              <div className="flex items-center justify-end pr-4 py-2 text-sm font-medium text-gray-600">
                {timeSlot}
              </div>

              {/* Date cells */}
              {dates.map((date) => {
                const dateTasks = getTasksForTimeSlot ? getTasksForTimeSlot(date, timeSlot) : [];
                
                return (
                  <div
                    key={`${date.toISOString()}-${timeSlot}`}
                    className="min-h-[80px] p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
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