import { createApp } from 'vue'
import { plugin as VueTippy } from 'vue-tippy'
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import App from './App.vue'
import '@/assets/style/index.css'

const app = createApp(App);
const isDev = import.meta.env.mode === 'development';

app.config.devtools = isDev;
app.config.performance = isDev;

app.use(VueTippy, {
  defaultProps: {
    theme: 'system',
    animation: 'system',
    delay: [500, 0],
    duration: [120, 70],
    allowHTML: true,
  },
});

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: `sidedrive@${import.meta.env.npm_package_version}`,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', 'sidedrive.app', /^\//],
    }),
  ],
  tracesSampleRate: 1.0,
  logErrors: isDev,
});

app.mount('#app')
