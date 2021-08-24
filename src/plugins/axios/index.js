import axios from 'axios';
import Vue from 'vue';

const plugin = {};
plugin.install = (vue) => {
  const service = axios.create({
    baseURL: ''
  });
  window.axios = service;
  vue.prototype.$axios = service;
};
Vue.use(plugin, {
});
export default plugin;
