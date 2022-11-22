import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs'
import contextmenujs from 'vue-contextmenujs'
import axios from 'axios' 

Vue.use(contextmenujs);
Vue.use(qs)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
