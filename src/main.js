import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router';
//import errorHandler from './plugins/errorHandler';

const app = createApp(App);

app.use(router);
//app.use(errorHandler);

app.mount('#app');
