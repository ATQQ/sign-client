import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import activity from './modules/activity'
import people from './modules/people'
import sign from './modules/sign'
import record from './modules/record'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    activity,
    people,
    sign,
    record
  }
})
