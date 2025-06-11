import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const StickyNote = ({ task, onUpdate, onDelete, onDragStart, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

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

  const rotationClasses = [
    'sticky-rotate-1',
    'sticky-rotate-2',
    'sticky-rotate-3',
    'sticky-rotate-4'
  ];

  const rotation = rotationClasses[Math.abs(task.id.charCodeAt(0)) % rotationClasses.length];

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const toggleCompleted = () => {
    onUpdate({ completed: !task.completed });
  };

  return (
    <AnimatePresence>
      <Button
        layout
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ 
          opacity: isDragging ? 0.7 : 1, 
          scale: isDragging ? 1.05 : 1,
          rotate: isDragging ? 0 : undefined
        }}
        exit={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileHover={{ 
          scale: 1.02, 
          rotate: 0,
          transition: { duration: 0.1 }
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={onDragStart}
        className={`
          relative w-48 h-32 p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing
          shadow-sticky hover:shadow-sticky-hover transition-all duration-100
          ${colorClasses[task.color] || colorClasses.yellow}
          ${!isDragging ? rotation : ''}
          ${task.completed ? 'opacity-60' : ''}
        `}
      >
        {/* Delete Button */}
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors z-10"
        >
          <ApperIcon name="X" size={12} />
        </Button>

        {/* Completed Checkbox */}
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleCompleted}
          className={`
            absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
            ${task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-surface-400 hover:border-green-400'
            }
          `}
        >
          {task.completed && <ApperIcon name="Check" size={12} />}
        </Button>

        {/* Task Content */}
        <div className="mt-6 h-full flex flex-col">
          {isEditing ? (
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-none text-surface-900 font-medium text-sm resize-none w-full"
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className={`
                flex-1 text-sm font-medium break-words cursor-text
                ${task.completed ? 'line-through text-surface-600' : 'text-surface-900'}
              `}
            >
              {task.title}
            </div>
          )}

          {/* Time Display */}
          <div className="mt-auto pt-2">
            <span className="text-xs text-surface-600 font-medium">
              {task.timeSlot}
            </span>
          </div>
        </div>
      </Button>
    </AnimatePresence>
  );
};

export default StickyNote;