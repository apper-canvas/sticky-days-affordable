import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StickyNote from '@/components/molecules/StickyNote';

const DailyTimeline = ({ 
  timeSlots, 
  tasks, 
  handleDragOver, 
  handleDrop, 
  getTasksForTimeSlot,
  handleUpdateTask,
  handleDeleteTask,
  handleDragStart,
  draggedTask 
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-1">
        {timeSlots.map((timeSlot, index) => {
          const tasksInSlot = getTasksForTimeSlot(timeSlot);
          const isEvenRow = index % 2 === 0;
          
          return (
            <motion.div
              key={timeSlot}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start space-x-6 p-4 rounded-lg min-h-[80px] transition-colors ${
                isEvenRow ? 'bg-white' : 'bg-surface-50'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, timeSlot)}
            >
              {/* Time Label */}
              <div className="w-20 flex-shrink-0 pt-2">
                <span className="text-sm font-medium text-surface-600">
                  {timeSlot}
                </span>
              </div>

              {/* Task Area */}
              <div className="flex-1 min-w-0">
                {tasksInSlot.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                      {tasksInSlot.map((task) => (
                        <StickyNote
                          key={task.id}
                          task={task}
                          onUpdate={(updates) => handleUpdateTask(task.id, updates)}
                          onDelete={() => handleDeleteTask(task.id)}
                          onDragStart={() => handleDragStart(task)}
                          isDragging={draggedTask?.id === task.id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="h-16 border-2 border-dashed border-surface-200 rounded-lg flex items-center justify-center text-surface-400 text-sm">
                    Drop tasks here or click "New Task" above
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyTimeline;