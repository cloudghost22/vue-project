import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import VueRouter from 'vue-router';
import Axios from 'axios';
import store from './store/store';
import router from './router'

import waterfall from 'vue-waterfall2'

Vue.prototype.$http = Axios;
Vue.use(ElementUI);

// import waterfall from '../lib'

Vue.use(waterfall)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
