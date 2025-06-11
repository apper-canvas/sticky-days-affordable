import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfDay, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import { taskService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import DateRangePicker from '@/components/organisms/DateRangePicker';
import RangeTimeline from '@/components/organisms/RangeTimeline.jsx';
import NewTaskForm from '@/components/organisms/NewTaskForm';
import Modal from '@/components/molecules/Modal';

const HomePage = () => {
  const [dateRange, setDateRange] = useState(() => {
    const today = startOfDay(new Date());
    return {
      start: today,
      end: addDays(today, 6),
      type: '7days'
    };
  });
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
  }, [dateRange]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const startStr = format(dateRange.start, 'yyyy-MM-dd');
      const endStr = format(dateRange.end, 'yyyy-MM-dd');
      const result = await taskService.getByDateRange(startStr, endStr);
      setTasks(result);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

const handleCreateTask = async (taskData) => {
    try {
      // Default to today if no date specified, otherwise use the provided date
      const taskDate = taskData.date || format(new Date(), 'yyyy-MM-dd');
      const newTask = await taskService.create({
        ...taskData,
        date: taskDate
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

const handleRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const navigateRange = (direction) => {
    const rangeDays = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) + 1;
    const offset = direction === 'prev' ? -rangeDays : rangeDays;
    
    setDateRange(prev => ({
      ...prev,
      start: addDays(prev.start, offset),
      end: addDays(prev.end, offset)
    }));
  };

  const goToToday = () => {
    const today = startOfDay(new Date());
    let start, end;
    
    switch (dateRange.type) {
      case '7days':
        start = today;
        end = addDays(today, 6);
        break;
      case '14days':
        start = today;
        end = addDays(today, 13);
        break;
      case '30days':
        start = today;
        end = addDays(today, 29);
        break;
      default:
        start = today;
        end = addDays(today, 6);
    }
    
    setDateRange(prev => ({ ...prev, start, end }));
  };

  const getTasksForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  const getTasksForTimeSlot = (date, timeSlot) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr && task.timeSlot === timeSlot);
  };
if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-2"
              >
                <div className="h-8 bg-surface-200 rounded animate-pulse"></div>
                {timeSlots.slice(0, 4).map((_, slotIndex) => (
                  <div key={slotIndex} className="h-16 bg-surface-100 rounded-lg animate-pulse"></div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <DateRangePicker
        dateRange={dateRange}
        onRangeChange={handleRangeChange}
        onNavigate={navigateRange}
        onGoToToday={goToToday}
        onNewTaskClick={() => setShowNewTaskForm(true)}
      />

      <RangeTimeline
        dateRange={dateRange}
        timeSlots={timeSlots}
        tasks={tasks}
        getTasksForDate={getTasksForDate}
        getTasksForTimeSlot={getTasksForTimeSlot}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleUpdateTask={handleUpdateTask}
        handleDeleteTask={handleDeleteTask}
        handleDragStart={handleDragStart}
        draggedTask={draggedTask}
      />

      <Modal isOpen={showNewTaskForm} onClose={() => setShowNewTaskForm(false)}>
        <NewTaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowNewTaskForm(false)}
          timeSlots={timeSlots}
          dateRange={dateRange}
        />
      </Modal>
    </div>
  );
};

export default HomePage;