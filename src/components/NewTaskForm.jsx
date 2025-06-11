import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const NewTaskForm = ({ onSubmit, onCancel, timeSlots }) => {
  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [color, setColor] = useState('yellow');

  const colors = [
    { name: 'yellow', class: 'bg-stickyNote-yellow border-yellow-300' },
    { name: 'pink', class: 'bg-stickyNote-pink border-pink-300' },
    { name: 'green', class: 'bg-stickyNote-green border-green-300' },
    { name: 'blue', class: 'bg-stickyNote-blue border-blue-300' },
    { name: 'orange', class: 'bg-stickyNote-orange border-orange-300' },
    { name: 'purple', class: 'bg-stickyNote-purple border-purple-300' },
    { name: 'teal', class: 'bg-stickyNote-teal border-teal-300' },
    { name: 'lime', class: 'bg-stickyNote-lime border-lime-300' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        timeSlot,
        color,
        completed: false
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900">
          Create New Task
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="text-surface-400 hover:text-surface-600"
        >
          <ApperIcon name="X" size={20} />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            autoFocus
            required
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Time Slot
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">
            Sticky Note Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colors.map(colorOption => (
              <motion.button
                key={colorOption.name}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setColor(colorOption.name)}
                className={`
                  h-12 rounded-lg border-2 transition-all relative
                  ${colorOption.class}
                  ${color === colorOption.name 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'hover:scale-105'
                  }
                `}
              >
                {color === colorOption.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ApperIcon name="Check" size={16} className="text-surface-700" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Preview
          </label>
          <div className={`
            w-full h-20 p-3 rounded-lg border-2 
            ${colors.find(c => c.name === color)?.class}
          `}>
            <div className="text-sm font-medium text-surface-900 mb-1">
              {title || 'Your task title...'}
            </div>
            <div className="text-xs text-surface-600">
              {timeSlot}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Task
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;