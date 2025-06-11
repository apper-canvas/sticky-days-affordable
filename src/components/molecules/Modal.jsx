import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ModalOverlay from '@/components/atoms/ModalOverlay';

const Modal = ({ children, onClose, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalOverlay onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;