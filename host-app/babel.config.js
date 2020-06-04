/*
 * @Description:
 * @Author: zhaoj
 * @Date: 2020-06-03 16:06:08
 * @LastEditTime: 2020-06-04 10:59:18
 * @LastEditors: zhaoj
 */

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
