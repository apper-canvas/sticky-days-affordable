import HomePage from '@/components/pages/HomePage';
import CalendarPage from '@/components/pages/CalendarPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Daily',
path: '/',
    icon: 'Clock',
    component: HomePage
  },
  daily: {
    id: 'daily',
    label: 'Daily',
    path: '/daily',
    icon: 'Clock',
    component: HomePage
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'X',
    component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);