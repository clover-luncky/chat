import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupAssets, setupScrollbarStyle } from './plugins'

async function bootstrap() {
    const app = createApp(App)

    setupAssets()
    setupScrollbarStyle()
    setupStore(app)
    await setupRouter(app)
    app.mount('#app')
}

bootstrap()
