import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '../../plugins/axios';
import store from '../../store';

import Tpl from './index.vue';

Vue.use(ElementUI);

new Vue({
  store,
  render: h => h(Tpl),
}).$mount('#app');
