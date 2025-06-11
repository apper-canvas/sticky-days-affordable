import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const DateNavigation = ({ 
  currentDate, 
  navigateDate, 
  goToToday, 
  onNewTaskClick, 
  titleFormat, 
  showNewTaskButton = false 
}) => {
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
          
          <h2 className="text-xl font-heading font-semibold text-surface-900">
            {format(currentDate, titleFormat)}
          </h2>
          
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
};

export default DateNavigation;