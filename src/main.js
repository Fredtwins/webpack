import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'

import router from './router'
import store from './store'
import App from './App'

import 'common/scss/reset'

Vue.use(VueRouter)

/* eslint-disable */
new Vue({ // eslint-disable-line
  el: '#root',
  router,
  store,
  render: h => h(App)
})
/* eslint-enable */
