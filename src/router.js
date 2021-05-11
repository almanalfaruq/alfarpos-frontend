import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
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
      path: '/logout',
      meta: {
        requiresAuth: true,
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
    if (to.matched.some(route => route.path === '/logout')) {
      sessionStorage.removeItem('token');
      store.commit('setToken', null);
      router.push({
        path: '/',
      });
    } else if (sessionStorage.getItem('token') === null) {
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
