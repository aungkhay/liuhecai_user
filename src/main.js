import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './routers'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)

import moment from 'moment';
app.config.globalProperties.$filters = {
    formatDate(date) {
        return moment(date).format('YYYY-MM-DD')
    }
}

app.use(pinia)
app.use(vuetify)
app.use(router)
app.mount('#app')