import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'
import store from './store'
import './assets/css/normalize.css'
import './plugins/element.js'
import clipboard from 'clipboard'
import './assets/font/Helvetica.css'
import './assets/icon_font/iconfont.css'

Vue.use(VueI18n)
// 注册到vue原型上
Vue.prototype.clipboard = clipboard

Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
const i18n = new VueI18n({
  // 默认语言
  locale: localStorage.getItem('lang') || 'en_us',
  // 引入对应的语言包文件
  messages: {
    'en_us': require('./assets/languages/en_us.json'),
    'zh_cn': require('./assets/languages/zh_cn.json')
  }
});
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
