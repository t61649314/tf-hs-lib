// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'normalize.css'
import './assets/css/base.less'
import App from './App'
import router from './router'
import './assets/lib/clipboard.min'
import './assets/lib/flexible'
import './assets/font/fontawesome-webfont.woff2'

Vue.use(MintUI)
Vue.config.productionTip = false
window.addEventListener('touchstart', function () {
});
window.onload = function () {
  var clipboard = new Clipboard('.clipboard-btn');
  clipboard.on('success', function (e) {
    console.log(e);
  });
  clipboard.on('error', function (e) {
    console.log(e);
  });
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
