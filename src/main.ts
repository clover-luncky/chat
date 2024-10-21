import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales/'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupAssets, setupScrollbarStyle } from './plugins'

async function bootstrap() {
    const app = createApp(App)

    setupAssets()
    setupScrollbarStyle()
    setupStore(app)
    setupI18n(app)
    await setupRouter(app)
    app.mount('#app')
}

bootstrap()
