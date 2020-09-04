const path = require('path')
const { name } = require('./package')

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
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}`,
      filename: `[name].js`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
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
