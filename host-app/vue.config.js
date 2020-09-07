const port = 8100

module.exports = {
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
      args[0].title = '国久大数据协同办公平台'
      return args
    })
  }
}
