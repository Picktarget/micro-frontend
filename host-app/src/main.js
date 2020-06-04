/*
 * @Description:
 * @Author: zhaoj
 * @Date: 2020-06-03 16:06:08
 * @LastEditTime: 2020-06-04 11:05:54
 * @LastEditors: zhaoj
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { registerMicroApps, setDefaultMountApp, start } from 'qiankun'

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

registerMicroApps(
  [
    {
      name: 'sub-auth',
      entry: '//localhost:7100',
      container: '#sub-container',
      activeRule: '/auth'
    }
  ],
  {
    beforeLoad: [
      app => {
        console.log('before load', app)
      }
    ], // 挂载前回调
    beforeMount: [
      app => {
        console.log('before mount', app)
      }
    ], // 挂载后回调
    afterUnmount: [
      app => {
        console.log('after unload', app)
      }
    ] // 卸载后回调
  }
)
setDefaultMountApp('/')
start()
