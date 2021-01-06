import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Toast from 'components/common/toast'
Vue.use(Toast)

//解决客户端300ms延迟
import FastClick from 'fastclick'
FastClick.attach(document.body)

//图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: require("./assets/img/common/placeholder.png")
})


Vue.config.productionTip = false

//添加事件总线
Vue.prototype.$bus = new Vue()


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
