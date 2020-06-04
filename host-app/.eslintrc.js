/*
 * @Description:
 * @Author: zhaoj
 * @Date: 2020-06-03 16:06:08
 * @LastEditTime: 2020-06-03 16:07:51
 * @LastEditors: zhaoj
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
