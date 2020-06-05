/*
 * @Description:
 * @Author: zhaoj
 * @Date: 2020-06-03 16:17:56
 * @LastEditTime: 2020-06-04 15:54:28
 * @LastEditors: zhaoj
 */

import './public-path'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI)

let router = null
let instance = null

function render(props = {}) {
  const { container } = props
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/auth' : '/',
    mode: 'history',
    routes
  })

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange((value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true)
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name
      }
    })
}

export async function bootstrap({ components, utils, pager }) {
  console.log('[vue] vue app bootstraped')
  Vue.use(components) // 注册主应用下发的组件

  Vue.prototype.$mainUtils = utils // 把工具函数挂载在vue $mainUtils对象

  // Object.keys(emitFnc).forEach(i => {
  //   // 把mainEmit函数一一挂载
  //   Vue.prototype[i] = emitFnc[i]
  // })

  pager.subscribe(v => {
    // 在子应用注册呼机监听器，这里可以监听到其他应用的广播
    console.log(`监听到子应用${v.from}发来消息：`, v)
    // store.dispatch('app/setToken', v.token)   // 在子应用中监听到其他应用广播的消息后处理逻辑
  })
  Vue.prototype.$pager = pager
}

export async function mount(props) {
  console.log('[vue] props from main framework', props)
  storeTest(props)
  render(props)
}

export async function unmount() {
  instance.$destroy()
  instance = null
  router = null
}
