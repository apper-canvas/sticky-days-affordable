import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfDay, addDays, subDays } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import StickyNote from '../components/StickyNote';
import NewTaskForm from '../components/NewTaskForm';
import { taskService } from '../services';

const Daily = () => {
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  useEffect(() => {
    loadTasks();
  }, [currentDate]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const result = await taskService.getByDate(dateStr);
      setTasks(result);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const newTask = await taskService.create({
        ...taskData,
        date: dateStr
      });
      setTasks(prev => [...prev, newTask]);
      setShowNewTaskForm(false);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, timeSlot) => {
    e.preventDefault();
    if (draggedTask && draggedTask.timeSlot !== timeSlot) {
      handleUpdateTask(draggedTask.id, { timeSlot });
    }
    setDraggedTask(null);
  };

  const navigateDate = (direction) => {
    setCurrentDate(prev => 
      direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(startOfDay(new Date()));
  };

  const getTasksForTimeSlot = (timeSlot) => {
    return tasks.filter(task => task.timeSlot === timeSlot);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl mx-auto p-6">
          {timeSlots.map((slot, index) => (
            <motion.div
              key={slot}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-6"
            >
              <div className="w-20 h-6 bg-surface-200 rounded animate-pulse"></div>
              <div className="flex-1 h-16 bg-surface-100 rounded-lg animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Date Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </motion.button>
            
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              {format(currentDate, 'EEEE, MMMM d')}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </motion.button>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Today
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewTaskForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>New Task</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Timeline */}
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

      {/* New Task Form Modal */}
      <AnimatePresence>
        {showNewTaskForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowNewTaskForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <NewTaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowNewTaskForm(false)}
                timeSlots={timeSlots}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Daily;