import Vue from 'vue';
import Axios from 'axios';
import global from '@/mixins/global';
import VueSweetalert2 from 'vue-sweetalert2';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import 'sweetalert2/src/sweetalert2.scss';

Vue.config.productionTip = false;
Vue.config.keyCodes.f2 = 113;
Vue.config.keyCodes.f3 = 114;
Vue.config.keyCodes.f7 = 118;
Vue.config.keyCodes.f8 = 119;
Vue.prototype.$http = Axios;
Vue.prototype.$_ = require('lodash');

Vue.mixin(global);
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
