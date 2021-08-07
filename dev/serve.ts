import Vue, { VNode } from 'vue';
import App from './components/App.vue';
import VueCompositionAPI from '@vue/composition-api'
import vuetify from '@/plugins/vuetify' // path to vuetify export

Vue.use(VueCompositionAPI)

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount('#app');
