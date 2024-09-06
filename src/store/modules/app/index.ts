import { defineStore } from "pinia";
import { getLocalSetting, setLocalSetting } from './helper'
import type { AppState } from './helper'

export const useAppStore = defineStore('app-store', {
    state: (): AppState => getLocalSetting(),
    actions: {
        setSiderCollapsed(collapsed: boolean) {
            this.siderCollapsed = collapsed
            this.recordState()
        },
        recordState() {
            setLocalSetting(this.$state)
        }
    }
})