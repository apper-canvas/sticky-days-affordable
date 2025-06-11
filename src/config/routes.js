import Home from '../pages/Home';
import Daily from '../pages/Daily';
import Calendar from '../pages/Calendar';

export const routes = {
  home: {
    id: 'home',
    label: 'Daily',
    path: '/',
    icon: 'Clock',
    component: Home
  },
  daily: {
    id: 'daily',
    label: 'Daily',
    path: '/daily',
    icon: 'Clock',
    component: Daily
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  }
};

export const routeArray = Object.values(routes);