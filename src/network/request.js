import Vue from 'vue'
import axios from 'axios'
import Router from '../router/index'
import Store from '../store/index'
import { getToken } from "../utils/utils";

import { Message } from 'element-ui'
// import { Store } from 'vuex'
Vue.prototype.axios = axios


// 测试环境
const baseURL = '/api'


// 正式环境
// const baseURL = 'https://www.84club.com/api'


// const baseURL = 'http://84club.chuangjisu.com/nft'


var request = axios.create({
  baseURL,
  timeout: 30000
})


let pending = [];
let cancelToken = axios.CancelToken;
let cancelPending = (config) => {
  pending.forEach((item, index) => {
    if (!!config) {
      if (item.u == config.url) {
        item.f(); //取消请求
        pending.splice(index, 1); //移除当前请求记录
      };
    } else {
      item.f(); //取消请求
      pending.splice(index, 1); //移除当前请求记录
    }
  })
}

// 请求拦截器
request.interceptors.request.use(config => {
  cancelPending(config);
  config.cancelToken = new cancelToken((c) => {
    pending.push({ 'u': config.url, 'f': c });
  });
  return config;
}, err => {
  return Promise.reject(err);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  if (response.data.status === 2) {//请求失败 --会话过期
    //登录token失效跳到登录页面
    let lang = localStorage.getItem('lang') || 'en_us'
    switch (lang) {
      case "en_us": Message.error('Please log in'); break;
      case "zh_cn": Message.error('请登录'); break;
    }

    var exp = new Date();
    exp.setTime(exp.getTime() - 10);
    var  token = getToken()
    document.cookie = 'token' + "=" + token + ";expires=" + exp.toUTCString();

    Store.commit("loginSuccess",false);

    Router.push({ path: '/login' });
    // location.reload()
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});



axios.defaults.headers.post['Content-Type'] = 'application/json';
export { request,baseURL }