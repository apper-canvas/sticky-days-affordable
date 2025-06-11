import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, eachDayOfInterval, isToday, addDays } from 'date-fns';
import StickyNote from '@/components/molecules/StickyNote';

const RangeTimeline = ({ 
  dateRange,
  timeSlots, 
  tasks, 
  getTasksForDate,
  getTasksForTimeSlot,
  handleDragOver, 
  handleDrop, 
  handleUpdateTask,
  handleDeleteTask,
  handleDragStart,
  draggedTask 
}) => {
// Safely generate days array with proper date handling
  const getDaysFromRange = () => {
    try {
      if (!dateRange?.start || !dateRange?.end) return [];
      
      const start = dateRange.start instanceof Date ? dateRange.start : new Date(dateRange.start);
      const end = dateRange.end instanceof Date ? dateRange.end : new Date(dateRange.end);
      
      // Validate dates
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return [];
      }
      
      return eachDayOfInterval({ start, end });
    } catch (error) {
      console.error('Error generating days from range:', error);
      return [];
    }
  };

  const days = getDaysFromRange();
  const isLargeRange = days.length > 14;

  const handleDropOnDate = (e, date, timeSlot) => {
    e.preventDefault();
    if (draggedTask) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const updates = { 
        date: dateStr,
        ...(timeSlot && { timeSlot })
      };
      
      if (draggedTask.date !== dateStr || (timeSlot && draggedTask.timeSlot !== timeSlot)) {
        handleUpdateTask(draggedTask.id, updates);
      }
    }
  };

  if (isLargeRange) {
    // Compact view for large ranges (30 days)
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {days.map((day, dayIndex) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentDay = isToday(day);
              
              return (
                <motion.div
                  key={format(day, 'yyyy-MM-dd')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.02 }}
                  className={`bg-white rounded-lg border-2 p-4 min-h-[200px] ${
                    isCurrentDay 
                      ? 'border-primary bg-primary/5' 
                      : 'border-surface-200 hover:border-surface-300'
                  } transition-colors`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnDate(e, day)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className={`font-medium ${isCurrentDay ? 'text-primary' : 'text-surface-900'}`}>
                        {format(day, 'EEE d')}
                      </h3>
                      <p className="text-xs text-surface-500">
                        {format(day, 'MMM yyyy')}
                      </p>
                    </div>
                    {isCurrentDay && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {dayTasks.length > 0 ? (
                      <div className="space-y-2">
                        {dayTasks.slice(0, 3).map((task) => (
                          <StickyNote
                            key={task.id}
                            task={task}
                            onUpdate={(updates) => handleUpdateTask(task.id, updates)}
                            onDelete={() => handleDeleteTask(task.id)}
                            onDragStart={() => handleDragStart(task)}
                            isDragging={draggedTask?.id === task.id}
                            compact={true}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-surface-500 text-center py-1">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-12 border border-dashed border-surface-200 rounded flex items-center justify-center text-surface-400 text-xs">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Detailed view for smaller ranges (7-14 days)
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-fit">
        {/* Header with dates */}
        <div className="sticky top-0 bg-white border-b border-surface-200 z-10">
          <div className="flex">
            <div className="w-20 flex-shrink-0 p-4 border-r border-surface-200">
              <span className="text-sm font-medium text-surface-600">Time</span>
            </div>
            {days.map((day) => {
              const isCurrentDay = isToday(day);
              return (
                <div 
                  key={format(day, 'yyyy-MM-dd')} 
                  className={`flex-1 min-w-[180px] p-4 text-center border-r border-surface-200 ${
                    isCurrentDay ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`font-medium ${isCurrentDay ? 'text-primary' : 'text-surface-900'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-sm ${isCurrentDay ? 'text-primary' : 'text-surface-600'}`}>
                    {format(day, 'MMM d')}
                  </div>
                  {isCurrentDay && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="space-y-1">
          {timeSlots.map((timeSlot, slotIndex) => (
            <motion.div
              key={timeSlot}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: slotIndex * 0.05 }}
              className={`flex ${slotIndex % 2 === 0 ? 'bg-white' : 'bg-surface-50'}`}
            >
              <div className="w-20 flex-shrink-0 p-4 border-r border-surface-200">
                <span className="text-sm font-medium text-surface-600">
                  {timeSlot}
                </span>
              </div>
              
              {days.map((day) => {
                const tasksInSlot = getTasksForTimeSlot(day, timeSlot);
                const isCurrentDay = isToday(day);
                
                return (
                  <div
                    key={`${format(day, 'yyyy-MM-dd')}-${timeSlot}`}
                    className={`flex-1 min-w-[180px] p-2 border-r border-surface-200 min-h-[80px] ${
                      isCurrentDay ? 'bg-primary/5' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnDate(e, day, timeSlot)}
                  >
                    {tasksInSlot.length > 0 ? (
                      <div className="space-y-2">
                        <AnimatePresence>
                          {tasksInSlot.map((task) => (
                            <StickyNote
                              key={task.id}
                              task={task}
                              onUpdate={(updates) => handleUpdateTask(task.id, updates)}
                              onDelete={() => handleDeleteTask(task.id)}
                              onDragStart={() => handleDragStart(task)}
                              isDragging={draggedTask?.id === task.id}
                              compact={true}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="h-16 border border-dashed border-surface-200 rounded flex items-center justify-center text-surface-400 text-xs">
                        Drop here
                      </div>
                    )}
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

export default RangeTimeline;