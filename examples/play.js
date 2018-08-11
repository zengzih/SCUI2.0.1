import Vue from 'vue';
import Resource from 'vue-resource';
import Element from 'main/index.js';
import App from './play/select.vue';
import 'packages/theme-default/src/index.css';

Vue.use(Element);
Vue.use(Resource);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
