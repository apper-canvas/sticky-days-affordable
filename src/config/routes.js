import homepage from '@/components/pages/homepage';
import calendarpage from '@/components/pages/calendarpage';
import notfoundpage from '@/components/pages/notfoundpage';

export const routes = {
  home: {
    id: 'home',
    label: 'Daily',
    path: '/',
    icon: 'Clock',
    component: homepage
  },
  daily: {
    id: 'daily',
    label: 'Daily',
    path: '/daily',
    icon: 'Clock',
    component: homepage
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: calendarpage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'X',
    component: notfoundpage
  }
};

export const routeArray = Object.values(routes);