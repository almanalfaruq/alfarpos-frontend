import { createRouter, createWebHistory } from 'vue-router';
import HomeDashboard from './components/DashboardPage/HomeDashboard.vue';
import ProductDashboard from './components/DashboardPage/ProductDashboard.vue';
import store from './store';
import CashierPage from './views/CashierPage.vue';
import DashboardPage from './views/DashboardPage.vue';
import LoginPage from './views/LoginPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          meta: {
            adminOnly: true,
          },
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
  // nav guard for auth page
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (sessionStorage.getItem('token') === null) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath },
      });
    } else if (
      to.matched.some(route => route.meta.adminOnly) &&
      store.getters.userLoggedIn.user.role_id !== 1
    ) {
      next({
        path: '/dashboard/product',
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else if (
    to.matched.some(route => route.name === 'LoginPage') &&
    sessionStorage.getItem('token') !== null
  ) {
    // nav guard for user accessing login page but user already logged in
    next({
      path: '/dashboard',
      params: { nextUrl: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
