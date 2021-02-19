import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang:"",    
    isLogin:false,
    searchContent:"",
    detailCurrent:-1
  },
  mutations: {
    changeLnag(state,paylod){
      return state.lang = paylod
    },
    loginSuccess(state,paylod){
      return state.isLogin = paylod
    },
    searchClick(state,paylod){
      return state.searchContent = paylod
    },
    detailCurrent(state,paylad){
      return state.detailCurrent = paylad
    }
  },
  actions: {
  },
  modules: {
  }
})
