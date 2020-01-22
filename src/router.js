import Vue from 'vue';
import Router from 'vue-router';
import CashierPage from './views/CashierPage.vue';
import LoginPage from './views/LoginPage.vue';
import DashboardPage from './views/DashboardPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/cashier',
      name: 'CashierPage',
      component: CashierPage,
    },
    {
      path: '/dashboard',
      name: 'DashboardPage',
      component: DashboardPage,
    },
  ],
});
