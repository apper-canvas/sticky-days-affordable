import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, ...props }) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;