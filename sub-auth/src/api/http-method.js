import http from '@/http'
import Vue from 'vue'

export function postAction(url, param) {
  const parameter = param ? param : {}
  if (parameter.data == null || parameter.data == undefined) {
    return http.axios({
      url: url,
      method: 'post',
      data: parameter
    })
  }
  return http.axios({
    url: url,
    method: 'post',
    headers: parameter.headers,
    data: parameter.data
  })
}

//post method= {post | put}
export function httpAction(url, parameter, method) {
  return http.axios({
    url: url,
    method: method,
    data: parameter
  })
}

//put
export function putAction(url, parameter) {
  return http.axios({
    url: url,
    method: 'put',
    data: parameter
  })
}

//get
export function getAction(url, parameter) {
  return http.axios({
    url: url,
    method: 'get',
    params: parameter && parameter.data ? parameter.data : {},
    headers: parameter && parameter.headers ? parameter.headers : {}
  })
}
export function getActionTB(url, parameter) {
  return http.axios({
    url: url,
    async: false,
    method: 'get',
    params: parameter && parameter.data ? parameter.data : {},
    headers: parameter && parameter.headers ? parameter.headers : {}
  })
}
//deleteAction
export function deleteAction(url, parameter) {
  return http.axios({
    url: url,
    method: 'delete',
    params: parameter
  })
}

export function deleteBatchAction(url, parameter) {
  return http.axios({
    url: url,
    method: 'post',
    data: parameter
  })
}

export function getUserList(parameter) {
  return http.axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return http.axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getList(parameter) {
  return http.axios({
    url: api.http.axios,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return http.axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function save(parameter) {
  return http.axios({
    url: api,
    method: parameter.id == 0 ? 'post' : 'put',
    data: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter) {
  return http.axios({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

export function downloadData(url, parameter) {
  return http.axios({
    url: url,
    data: parameter,
    method: 'post',
    responseType: 'blob'
  })
}

export function getBlob(url, parameter) {
  return http.axios({
    url: url,
    params: parameter.data,
    method: 'get',
    headers: parameter.headers,
    responseType: 'blob'
  })
}

export function login(parameter) {
  const deviceId = localStorage.getItem('deviceId')
  return http.axios({
    url: '/auth/form',
    method: 'post',
    headers: {
      Authorization: 'Basic b2FfY2xpZW50Om9hX2NsaWVudF9zZWNyZXQ=',
      imageDeviceId: deviceId
    },
    data: parameter
  })
}

export function Logout() {
  return new Promise(resolve => {
    let logoutToken = Vue.ls.get('Access-Token')
    Vue.ls.remove('Access-Token')
    Vue.ls.remove('user_info')
    Vue.ls.remove('menu')
    Vue.ls.remove('KeyCtrl')
    Vue.ls.remove('Login_Username')
    Vue.ls.remove('Login_Userinfo')
    localStorage.removeItem('BUTTONS')
    logout(logoutToken)
      .then(res => {
        resolve(res)
      })
      .catch(() => {
        resolve()
      })
  })
}

function logout(logoutToken) {
  return http.axios({
    url: '/logOut',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + logoutToken
    }
  })
}
