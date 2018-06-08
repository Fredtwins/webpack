import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import state from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const isDev = process.env.NODE_ENV === 'development'

const store = new Vuex.Store({
  strict: isDev,
  state,
  getters,
  mutations,
  plugins: isDev ? [createLogger()] : []
})

export default store
