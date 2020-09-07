<template>
  <div class="main">
    <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
      <a-form-item>
        <a-input
          size="large"
          v-decorator="['username', validatorRules.username, { validator: this.handleUsernameOrEmail }]"
          type="text"
          placeholder="请输入帐户名 "
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="['password', validatorRules.password]"
          size="large"
          type="password"
          autocomplete="off"
          placeholder="密码 "
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-row :gutter="0">
        <a-col :span="14">
          <a-form-item>
            <a-input
              v-decorator="['inputCode', validatorRules.inputCode]"
              size="large"
              type="text"
              autocomplete="off"
              :maxLength="4"
              @change="inputCodeChange"
              placeholder="请输入验证码"
            >
              <a-icon
                slot="prefix"
                v-if="inputCodeContent == verifiedCode"
                type="smile"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
              <a-icon slot="prefix" v-else type="frown" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <j-graphic-code @success="generateCode" ref="jgraphicCodeRef" style="float: right" remote></j-graphic-code>
        </a-col>
      </a-row>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn"
          >确定
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import JGraphicCode from '@/components/JGraphicCode'

import { timeFix } from '@/utils/util'
import { putAction, postAction, login, Logout } from '@/api/http-method'
import { getEncryptedString } from '@/utils/aesEncrypt'

const USER_INFO = 'Login_Userinfo'
const ACCESS_TOKEN = 'Access-Token'
const ENCRYPTED_STRING = 'ENCRYPTED_STRING'

export default {
  components: {
    JGraphicCode
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login-sign type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      encryptedString: {
        key: '',
        iv: ''
      },
      state: {
        time: 60,
        smsSendBtn: false
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '',
        mobile: '',
        rememberMe: true
      },
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
        mobile: { rules: [{ validator: this.validateMobile }] },
        captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
        inputCode: { rules: [{ required: true, message: '请输入验证码!' }] }
      },
      verifiedCode: '',
      inputCodeContent: '',
      inputCodeNull: true,

      departList: [],
      departVisible: false,
      departSelected: '',
      currentUsername: '',
      validate_status: ''
    }
  },
  created() {
    this.$ls.remove(ACCESS_TOKEN)
    this.getRouterData()
    // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
    //this.getEncrypte();
    // update-end- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
  },
  methods: {
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit() {
      let that = this
      let loginParams = {
        remember_me: that.formLogin.rememberMe
      }
      that.loginBtn = true
      that.form.validateFields(['username', 'password', 'inputCode'], { force: true }, (err, values) => {
        if (!err) {
          loginParams.username = values.username
          loginParams.password = values.password
          loginParams.imageCode = values.inputCode
          login(loginParams)
            .then(res => {
              this.departConfirm(res)
            })
            .catch(res => {
              if (res.success) {
                this.departConfirm(res)
              } else {
                that.requestFailed(res)
              }
            })
        } else {
          that.loginBtn = false
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields(['mobile'], { force: true }, (err, values) => {
        if (!values.mobile) {
          that.cmsFailed('请输入手机号')
        } else if (!err) {
          this.state.smsSendBtn = true
          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          let smsParams = {}
          smsParams.mobile = values.mobile
          smsParams.smsmode = '0'
          postAction('/sys/sms', smsParams)
            .then(res => {
              if (!res.success) {
                setTimeout(hide, 0)
                this.cmsFailed(res.msg)
              }
              // window.console.log(res);
              setTimeout(hide, 500)
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              that.state.time = 60
              that.state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess() {
      const that = this
      const redirect = decodeURIComponent(this.$route.query.redirect)
      if (redirect && redirect !== '/' && redirect !== 'undefined') {
        this.$router.push({ path: redirect })
      } else {
        setTimeout(() => {
          // 异步处理了很多东西
          let menuList = this.$ls.get('menu')
          const url =
            menuList.length > 0
              ? menuList[0].children && menuList[0].children.length > 0
                ? menuList[0].children[0].path
                : menuList[0].path
              : '/'
          that.$router.push({ path: url })
        }, 300)
      }
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
    },
    cmsFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: err,
        duration: 4
      })
    },
    requestFailed(err) {
      window.console.log(err)
      this.$notification['error']({
        message: '登录失败',
        description: err.msg,
        duration: 4
      })
      this.loginBtn = false
      const dom = document.getElementById('code-img')
      dom.click()
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    validateInputCode(rule, value, callback) {
      if (!value || this.verifiedCode == this.inputCodeContent) {
        callback()
      } else {
        callback('您输入的验证码不正确!')
      }
    },
    generateCode(value) {
      this.verifiedCode = value.toLowerCase()
    },
    inputCodeChange(e) {
      this.inputCodeContent = e.target.value
      if (!e.target.value || 0 == e.target.value) {
        this.inputCodeNull = true
      } else {
        this.inputCodeContent = this.inputCodeContent.toLowerCase()
        this.inputCodeNull = false
      }
    },
    departConfirm(res) {
      if (res.success) {
        this.currentUsername = this.form.getFieldValue('username')
        this.loginSuccess()
      } else {
        this.requestFailed(res)
        Logout()
      }
    },
    departOk() {
      if (!this.departSelected) {
        this.validate_status = 'error'
        return false
      }
      let obj = {
        orgCode: this.departSelected,
        username: this.form.getFieldValue('username')
      }
      putAction('/sys/selectDepart', obj).then(res => {
        if (res.success) {
          const userInfo = res.data.userInfo
          this.$ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
          store.commit('SET_INFO', userInfo)
          //console.log("---切换组织机构---userInfo-------",store.getters.userInfo.orgCode);
          this.departClear()
          this.loginSuccess()
        } else {
          this.requestFailed(res)
          Logout().then(() => {
            this.departClear()
          })
        }
      })
    },
    departClear() {
      this.departList = []
      this.departSelected = ''
      this.currentUsername = ''
      this.departVisible = false
      this.validate_status = ''
    },
    departChange(value) {
      this.validate_status = 'success'
      this.departSelected = value
    },
    getRouterData() {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          username: this.$route.params.username
        })
      })
    },
    //获取密码加密规则
    getEncrypte() {
      var encryptedString = this.$ls.get(ENCRYPTED_STRING)
      if (encryptedString == null) {
        getEncryptedString().then(data => {
          this.encryptedString = data
        })
      } else {
        this.encryptedString = encryptedString
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .ant-form-item {
    margin-bottom: 30px;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
</style>
