import { defineStore } from "pinia";
import { getLocalSetting, setLocalSetting } from './helper'
import type { AppState, Theme, Language } from './helper'
import { store } from "@/store/helper";

export const useAppStore = defineStore('app-store', {
    state: (): AppState => getLocalSetting(),
    actions: {
        setSiderCollapsed(collapsed: boolean) {
            this.siderCollapsed = collapsed
            this.recordState()
        },
        // 设置主题
        setTheme(theme: Theme) {
            this.theme = theme
        },
        // 设置语言环境
        setLanguage(language: Language) {
            if(this.language !== language) {
                this.language = language
                this.recordState()
            }
        },
        recordState() {
            setLocalSetting(this.$state)
        }
    }
})

export function useAppStoreWithOut() {
    return useAppStore(store)
}