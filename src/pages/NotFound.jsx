import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        >
          <ApperIcon name="StickyNote" className="w-20 h-20 text-surface-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-surface-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">
          Looks like this sticky note fell off the board. Let's get you back to your tasks!
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Back to Daily View
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;