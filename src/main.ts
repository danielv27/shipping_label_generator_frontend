import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);

app.mount('#app');
