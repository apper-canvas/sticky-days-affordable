import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

async getByDate(date) {
    await delay(250);
    return tasks.filter(t => t.date === date).map(t => ({ ...t }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return tasks.filter(t => {
      const taskDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return taskDate >= start && taskDate <= end;
    }).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...updates };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks.splice(index, 1);
    return true;
  }
};

export default taskService;