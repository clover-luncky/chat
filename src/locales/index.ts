import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUs from './en-US'
import zhCN from './zh-CN'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { Language } from '@/store/modules/app/helper'

const appStore = useAppStoreWithOut()
const defaultLocale = appStore.language || 'zh-CN'
const i18n = createI18n({
    locale: defaultLocale,
    fallbackLocale: 'en-Us',
    allowComposition: true,
    messages: {
        'en-US': enUs,
        'zh-CN': zhCN
    }
})

// 注册语言转化参数
export const t = i18n.global.t
// 全局设置语言环境
export function setLocale(locale: Language) {
    i18n.global.locale = locale
}
// App设置语言
export function setupI18n(app: App) {
    app.use(i18n)
}
export default i18n