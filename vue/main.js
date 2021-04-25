import Vue from 'vue';
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui';
import promise from 'es6-promise';
import './assets/font/iconfont.css'
import "element-ui/lib/theme-chalk/index.css";
promise.polyfill();
// import VConsole from 'vconsole';
// const vConsole = new VConsole();


Vue.use(ElementUI);

Vue.config.productionTip = false


Vue.prototype.$goRoute = function (index, data) {
  this.$router.push({ path: index, query: data });
}

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
