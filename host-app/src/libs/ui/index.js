/*
 * @Description:
 * @Author: zhaoj
 * @Date: 2020-06-04 15:57:27
 * @LastEditTime: 2020-06-04 15:57:45
 * @LastEditors: zhaoj
 */
const components = []

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}
