import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { registerMicroApps, setDefaultMountApp, start } from 'qiankun'
import pager from './pager'
import '@/styles/index.scss'

// 导入主应用ui库
import LibraryUi from './libs/ui'
// 导入主应用工具类库
import LibraryJs from './libs/js'

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

pager.subscribe(v => {
  // 在主应用注册呼机监听器，这里可以监听到其他应用的广播
  console.log(`监听到子应用${v.from}发来消息：`, v)
})

let msg = {
  // 结合下章主应用下发资源给子应用，将pager作为一个模块传入子应用
  data: store.getters, // 从主应用仓库读出的数据
  components: LibraryUi, // 从主应用读出的组件库
  utils: LibraryJs, // 从主应用读出的工具类库
  pager // 从主应用下发应用间通信呼机
}

registerMicroApps(
  [
    {
      name: 'sub-auth',
      entry: '//localhost:7100',
      container: '#sub-container',
      activeRule: '/auth',
      props: msg
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
