import Vue from 'vue';
import Router from 'vue-router';
import CashierPage from './views/CashierPage.vue';
import LoginPage from './views/LoginPage.vue';

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
      }
    },
    {
      path: '/cashier',
      name: 'CashierPage',
      component: CashierPage,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (sessionStorage.getItem('token') === null) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(route => route.name === 'LoginPage') && sessionStorage.getItem('token') !== null) {
    next({
      path: '/cashier',
      params: { nextUrl: to.fullPath }
    })
  } else {
    next();
  }
})

export default router;
