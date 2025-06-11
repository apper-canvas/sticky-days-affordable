import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { format } from 'date-fns';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [currentDate] = useState(new Date());
  
  const isDaily = location.pathname === '/' || location.pathname === '/daily';
  const isCalendar = location.pathname === '/calendar';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-50">
      {/* Header */}
      <header className="flex-shrink-0 h-20 bg-white shadow-sm border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="StickyNote" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-surface-900">Sticky Days</h1>
              <p className="text-sm text-surface-500">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="bg-surface-100 p-1 rounded-lg">
              <NavLink
                to="/"
                className={({ isActive }) => `
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive || isDaily 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-surface-600 hover:text-surface-900 hover:bg-white'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={16} />
                  <span>Daily</span>
                </div>
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) => `
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive || isCalendar 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-surface-600 hover:text-surface-900 hover:bg-white'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={16} />
                  <span>Calendar</span>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;