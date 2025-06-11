import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import ColorSelector from '@/components/molecules/ColorSelector';

const NewTaskForm = ({ onSubmit, onCancel, timeSlots }) => {
  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [color, setColor] = useState('yellow');

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

  const colorClasses = {
    yellow: 'bg-stickyNote-yellow border-yellow-300',
    pink: 'bg-stickyNote-pink border-pink-300',
    green: 'bg-stickyNote-green border-green-300',
    blue: 'bg-stickyNote-blue border-blue-300',
    orange: 'bg-stickyNote-orange border-orange-300',
    purple: 'bg-stickyNote-purple border-purple-300',
    teal: 'bg-stickyNote-teal border-teal-300',
    lime: 'bg-stickyNote-lime border-lime-300'
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900">
          Create New Task
        </h3>
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="text-surface-400 hover:text-surface-600 p-1"
        >
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <FormField label="Task Title">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            autoFocus
            required
          />
        </FormField>

        {/* Time Slot */}
        <FormField label="Time Slot">
          <Select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            options={timeSlots}
          />
        </FormField>

        {/* Color Selection */}
        <ColorSelector selectedColor={color} onSelectColor={setColor} />

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Preview
          </label>
          <div className={`
            w-full h-20 p-3 rounded-lg border-2 
            ${colorClasses[color] || colorClasses.yellow}
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
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;