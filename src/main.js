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
import './assets/lib/rem.js'
import './assets/font/fontawesome-webfont.woff2'

const FastClick = require('fastclick');
FastClick.attach(document.body);


Vue.use(MintUI)
Vue.config.productionTip = false
window.addEventListener('touchstart', function () {
});
window.onload = function () {
  var clipboard = new Clipboard('.clipboard-btn');
  clipboard.on('success', function (e) {
    MintUI.Toast({
      message: '复制卡组成功',
      iconClass: 'mintui mintui-success'
    });
  });
  clipboard.on('error', function (e) {
    MintUI.Toast({
      message: '复制卡组失败',
      iconClass: 'mintui mintui-field-error'
    });
  });
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
