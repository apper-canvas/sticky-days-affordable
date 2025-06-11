import React from 'react';

const Select = ({ options, className, ...props }) => {
  return (
    <select
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${className || ''}`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
};

export default Select;