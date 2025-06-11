import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService } from '../services';

const Calendar = () => {
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
      
      // Get tasks for the entire month
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
    // Navigate to daily view for selected date
    navigate('/', { state: { selectedDate: date } });
  };

  // Generate calendar days
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
      {/* Month Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </motion.button>
            
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Today
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
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
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isTodayDate = isToday(date);
              
              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleDateClick(date)}
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
                      {dayTasks.slice(0, 3).map((task, taskIndex) => (
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;