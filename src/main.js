import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@fontsource/roboto/latin.css';
import '@mdi/font/css/materialdesignicons.css';

import customTheme from '@/theme';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  }
});

createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .mount('#app');
