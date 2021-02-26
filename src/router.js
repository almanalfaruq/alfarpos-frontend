import Vue from 'vue';
import Router from 'vue-router';
import CashierPage from './views/CashierPage.vue';
import LoginPage from './views/LoginPage.vue';
import DashboardPage from './views/DashboardPage.vue';
import HomeDashboard from './components/DashboardPage/HomeDashboard.vue';
import ProductDashboard from './components/DashboardPage/ProductDashboard.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/cashier',
      name: 'CashierPage',
      component: CashierPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/dashboard',
      component: DashboardPage,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'HomeDashboard',
          component: HomeDashboard,
        },
        {
          path: 'product',
          name: 'ProductDashboard',
          component: ProductDashboard,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (sessionStorage.getItem('token') === null) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else if (
    to.matched.some(route => route.name === 'LoginPage') &&
    sessionStorage.getItem('token') !== null
  ) {
    next({
      path: '/cashier',
      params: { nextUrl: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
