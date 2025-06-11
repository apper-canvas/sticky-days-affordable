import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { taskService } from '@/services';
import DateNavigation from '@/components/organisms/DateNavigation';
import CalendarGrid from '@/components/organisms/CalendarGrid';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMonthTasks();
  }, [currentMonth]);

  const loadMonthTasks = async () => {
    setLoading(true);
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const result = await taskService.getAll();
      const monthTasks = result.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });
      
      setTasks(monthTasks);
    } catch (error) {
      toast.error('Failed to load calendar tasks');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getTasksForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  const handleDateClick = (date) => {
    navigate('/', { state: { selectedDate: date } });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="aspect-square bg-surface-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <DateNavigation
        currentDate={currentMonth}
        navigateDate={navigateMonth}
        goToToday={goToToday}
        titleFormat="MMMM yyyy"
        showNewTaskButton={false}
      />
      <CalendarGrid
        currentMonth={currentMonth}
        calendarDays={calendarDays}
        weekDays={weekDays}
        getTasksForDate={getTasksForDate}
        handleDateClick={handleDateClick}
      />
    </div>
  );
};

export default CalendarPage;