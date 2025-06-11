import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

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

const ColorSelector = ({ selectedColor, onSelectColor }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-3">
        Sticky Note Color
      </label>
      <div className="grid grid-cols-4 gap-3">
        {colors.map(colorOption => (
          <Button
            key={colorOption.name}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectColor(colorOption.name)}
            className={`
              h-12 rounded-lg border-2 transition-all relative
              ${colorOption.class}
              ${selectedColor === colorOption.name 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:scale-105'
              }
            `}
          >
            {selectedColor === colorOption.name && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ApperIcon name="Check" size={16} className="text-surface-700" />
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;