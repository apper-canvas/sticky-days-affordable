import React, { useState } from 'react';
import { format, addDays, startOfDay, isToday, isValid } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const DateNavigation = ({ 
  currentDate,
  navigateDate,
  goToToday,
  titleFormat = 'MMMM yyyy',
  showNewTaskButton = true,
  dateRange, 
  onRangeChange, 
  onNavigate, 
  onGoToToday, 
  onNewTaskClick 
}) => {
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  // Calendar mode (single date navigation)
  if (currentDate && navigateDate) {
    return (
      <div className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </Button>
            
            <div className="flex flex-col">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                {isValid(currentDate) ? format(currentDate, titleFormat) : 'Invalid Date'}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-surface-600">
                {isToday(currentDate) && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Today
                  </span>
                )}
              </div>
            </div>
            
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Today
            </Button>
            
            {showNewTaskButton && (
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewTaskClick}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>New Task</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Range mode (date range navigation)
  if (!dateRange || !dateRange.start || !dateRange.end) {
    return (
      <div className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="text-surface-500">Please select a valid date range</div>
        </div>
      </div>
    );
  }

  const rangeOptions = [
    { value: '7days', label: '7 Days', days: 7 },
    { value: '14days', label: '14 Days', days: 14 },
    { value: '30days', label: '30 Days', days: 30 }
  ];

  const handleRangeTypeChange = (rangeType) => {
    const today = startOfDay(new Date());
    const option = rangeOptions.find(opt => opt.value === rangeType);
    
    if (option && onRangeChange) {
      onRangeChange({
        start: today,
        end: addDays(today, option.days - 1),
        type: rangeType
      });
    }
    setShowRangeDropdown(false);
  };

  const formatDateRange = () => {
    if (!isValid(dateRange.start) || !isValid(dateRange.end)) {
      return 'Invalid Date Range';
    }
    
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    // Same year
    if (startDate.getFullYear() === endDate.getFullYear()) {
      // Same month
      if (startDate.getMonth() === endDate.getMonth()) {
        const startStr = format(startDate, 'MMM d');
        const endStr = format(endDate, 'd, yyyy');
        return `${startStr} - ${endStr}`;
      } else {
        const startStr = format(startDate, 'MMM d');
        const endStr = format(endDate, 'MMM d, yyyy');
        return `${startStr} - ${endStr}`;
      }
    } else {
      const startStr = format(startDate, 'MMM d, yyyy');
      const endStr = format(endDate, 'MMM d, yyyy');
      return `${startStr} - ${endStr}`;
    }
  };

  const getCurrentRangeLabel = () => {
    const option = rangeOptions.find(opt => opt.value === dateRange.type);
    return option ? option.label : '7 Days';
  };

  const isCurrentRangeActive = () => {
    if (!isValid(dateRange.start) || !isValid(dateRange.end)) return false;
    const today = new Date();
    return today >= dateRange.start && today <= dateRange.end;
  };

  return (
    <div className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate && onNavigate('prev')}
            className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>
          
          <div className="flex flex-col">
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              {formatDateRange()}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <span>{getCurrentRangeLabel()}</span>
              {isCurrentRangeActive() && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  Current
                </span>
              )}
            </div>
          </div>
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate && onNavigate('next')}
            className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="px-4 py-2 text-sm font-medium text-surface-700 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Calendar" size={16} />
              <span>{getCurrentRangeLabel()}</span>
              <ApperIcon name="ChevronDown" size={14} />
            </Button>
            
            {showRangeDropdown && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-surface-200 rounded-lg shadow-lg z-10">
                {rangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRangeTypeChange(option.value)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-surface-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      dateRange.type === option.value ? 'bg-primary/5 text-primary font-medium' : 'text-surface-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoToToday || goToToday}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Today
          </Button>
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewTaskClick}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>New Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateNavigation;