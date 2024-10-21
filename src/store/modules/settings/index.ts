import { defineStore } from "pinia";
import { defaultSetting, getLocalState, removeLocalState, setLocalState, SettingsState } from "./helper";

export const useSettingsStore = defineStore('settings-store', {
    state: (): SettingsState => getLocalState(),
    actions: {
        updateSetting(settings: Partial<SettingsState>) {
            this.$state = { ...this.$state, ...settings }
            this.recordState()
        },
        resetSetting() {
            this.$state = defaultSetting()
            removeLocalState()
        },
        recordState() {
            setLocalState(this.$state)
        }
    }
})