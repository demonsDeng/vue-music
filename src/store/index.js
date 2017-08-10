import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger' // vuex内部插件,每当通过mutation修改state的时候，会在后台打印修改日志

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // vuex的调试参数,开发环境下为true，线上时（npm run build的时候，process.env.NODE_ENV为‘production’）此参数为false

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 开发环境下启用vuex的调试模式,线上时调试模式关闭
  plugins: debug ? [createLogger()] : []
})