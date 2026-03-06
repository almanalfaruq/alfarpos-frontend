import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Axios from 'axios'
import _ from 'lodash'
import globalMixin from '@/mixins/global'

const app = createApp(App)

app.config.globalProperties.$http = Axios
app.config.globalProperties.$_ = _

app.mixin(globalMixin)
app.use(router)
app.use(store)
app.use(vuetify)
app.use(VueSweetalert2)

app.mount('#app')
