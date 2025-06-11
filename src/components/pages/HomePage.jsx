import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfDay, addDays, subDays } from 'date-fns';
import { toast } from 'react-toastify';
import { taskService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import DateNavigation from '@/components/organisms/DateNavigation';
import DailyTimeline from '@/components/organisms/DailyTimeline';
import NewTaskForm from '@/components/organisms/NewTaskForm';
import Modal from '@/components/molecules/Modal';

const HomePage = () => {
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
      <DateNavigation
        currentDate={currentDate}
        navigateDate={navigateDate}
        goToToday={goToToday}
        onNewTaskClick={() => setShowNewTaskForm(true)}
        titleFormat="EEEE, MMMM d"
        showNewTaskButton={true}
      />

      <DailyTimeline
        timeSlots={timeSlots}
        tasks={tasks}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        getTasksForTimeSlot={getTasksForTimeSlot}
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
        />
      </Modal>
    </div>
  );
};

export default HomePage;