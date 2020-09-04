import Vue from 'vue'
import axios from 'axios'
const ACCESS_TOKEN = 'Access-Token'

// 创建 axios 实例
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:7100' + process.env.VUE_APP_BASE_API || ''
      : process.env.VUE_APP_BASE_API || '',
  timeout: 15000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    switch (error.response.status) {
      case 403:
        this.$notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
        break
      case 500:
        if (token && data.message == 'Token失效，请重新登录') {
          this.$error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              Vue.ls.remove(ACCESS_TOKEN)
              window.location.reload()
            }
          })
        }
        break
      case 404:
        this.$notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 504:
        this.$notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        this.$notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
        if (token) {
          setTimeout(() => {
            Vue.ls.remove(ACCESS_TOKEN)
            window.location.reload()
          }, 1500)
        }
        break
      default:
        this.$notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
}
let isErrorReporting = false
// request interceptor
instance.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    config.headers = config.headers ? config.headers : {}
    if (token && config.url.indexOf('code/image') < 0) {
      // image 带token报错
      config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    if (config.method == 'get') {
      if (config.url.indexOf('sys/dict/getDictItems') < 0) {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params
        }
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
instance.interceptors.response.use(response => {
  if (response.data.code === '403') {
    if (!isErrorReporting) {
      isErrorReporting = true
      this.$message.error(response.data.msg)
      setTimeout(() => {
        Vue.ls.clear()
        window.location.reload()
        isErrorReporting = false
      }, 500)
    }
  }
  return response.data
}, err)

export default instance
