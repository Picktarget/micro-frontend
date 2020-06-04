<!--
 * @Description: 
 * @Author: zhaoj
 * @Date: 2020-06-03 16:06:08
 * @LastEditTime: 2020-06-04 14:14:26
 * @LastEditors: zhaoj
--> 
<template>
  <div id="host-app">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          @select="handleSelect"
        >
          <el-menu-item index="1">处理中心</el-menu-item>
          <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="3" disabled>消息中心</el-menu-item>
          <el-menu-item index="4">
            <a href="https://www.ele.me" target="_blank">订单管理</a>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>主应用内路由</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">
                  <router-link to="/about">About</router-link>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <router-link to="/">首页</router-link>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="2" @click="routerGo('/auth')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">子应用1路由</span>
              </template>
              <el-menu-item index="2-1">
                <router-link to="/auth">选项1</router-link>
              </el-menu-item>
              <el-menu-item index="2-2">
                <router-link to="/auth/about">选项2</router-link>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">子应用2路由</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">子应用3路由</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
            <div id="sub-container"></div>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    /**
     * 跨应用路由跳转
     * @param {String} href url地址
     * @param {Object} stateObj 状态参数 可以通过history.state读取
     * @param {String} title 标题 暂时没有用
     */
    routerGo(href = '/', title = null, stateObj = {}) {
      history.pushState(stateObj, title, href)
    }
  }
}
</script>
<style lang="scss">
</style>
