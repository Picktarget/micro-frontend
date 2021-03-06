const path = require('path')
const packageName = require('./package').name

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = 7100 // dev port
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? '/auth-sub' : '/',
  outputDir: 'auth-sub',
  assetsDir: 'static',
  filenameHashing: true,
  devServer: {
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.PROXY_URL_1,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        },
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false
      },
      [process.env.VUE_APP_FILE_URL]: {
        target: process.env.PROXY_URL_2,
        pathRewrite: {
          ['^' + process.env.VUE_APP_FILE_URL]: ''
        },
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '协同办公平台认证中心'
      return args
    })

    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').set('@', resolve('src'))

    config.output.library = `${packageName}-[name]`
    config.output.libraryTarget = 'umd'
    config.output.jsonpFunction = `webpackJsonp_${packageName}`
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#3F579B',
            'link-color': '#3F579B',
            'border-color': '#3F579B'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
