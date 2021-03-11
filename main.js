import Vue from 'vue'
import App from './App'
import http from './src/utils/http'
import api from './src/api/index'

Vue.prototype.$http = http
Vue.prototype.$api = api

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
