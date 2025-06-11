import React from 'react';

const FormField = ({ label, children, className }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-surface-700 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;