import Vue from 'vue';
import Axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false;
Vue.config.keyCodes.f2 = 113;
Vue.config.keyCodes.f3 = 114;
Vue.config.keyCodes.f7 = 118;
Vue.config.keyCodes.f8 = 119;
Vue.prototype.$http = Axios;
Vue.prototype.$_ = require('lodash');

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
