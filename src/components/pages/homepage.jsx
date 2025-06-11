import { useState } from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
// TODO: Fix DateRangePicker import - component may not exist at this path
// import DateRangePicker from '@/components/organisms/DateRangePicker';
import RangeTimeline from '@/components/organisms/RangeTimeline';
import NewTaskForm from '@/components/organisms/NewTaskForm';
import Modal from '@/components/molecules/Modal';
/**
 * HomePage component - Main dashboard view showing timeline and task management
 */
const HomePage = () => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleOpenNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleCloseNewTask = () => {
    setIsNewTaskModalOpen(false);
  };

  const handleTaskCreated = (taskData) => {
    // Handle new task creation
    console.log('New task created:', taskData);
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApperIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Daily Overview</h1>
          </div>
          <button
            onClick={handleOpenNewTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>+</span>
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* Date Selection Area - Placeholder for future DateRangePicker */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          {/* TODO: Replace with DateRangePicker when component is available */}
          <div className="text-sm text-gray-500">
            Date range picker will be implemented here
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Timeline</h2>
          </div>
          <div className="p-4">
            <RangeTimeline 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </section>
      </main>

      {/* New Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={handleCloseNewTask}
        title="Create New Task"
      >
        <NewTaskForm
          onSubmit={handleTaskCreated}
          onCancel={handleCloseNewTask}
          initialDate={selectedDate}
        />
      </Modal>
    </div>
  );
};

HomePage.propTypes = {
  // Add prop types if props are added in future
};

export default HomePage;