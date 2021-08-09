import Vue from 'vue';
import { UserVuetifyPreset } from 'vue/services/presets';
//import Vuetify from 'vuetify/lib/framework';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

const opts : UserVuetifyPreset = {
    icons: {
      iconfont: 'mdi',  // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    },
    theme: {
      dark: false,
    },
    themes: {
      light: {
        primary: "#4682b4",
        secondary: "#b0bec5",
        accent: "#8c9eff",
        error: "#b71c1c",
      },
    },
  }

export default new Vuetify(opts)
