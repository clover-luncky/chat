import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
    systemMessage: string
    temperature: number
    top_p: number
}

// 设定默认值
export function defaultSetting(): SettingsState {
    return {
        systemMessage: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.',
        temperature: 0.8,
        top_p: 1,
    }
}

// 获取值
export function getLocalState(): SettingsState {
    const localSetting: SettingsState | undefined = ss.get(LOCAL_NAME)
    return { ...defaultSetting(), ...localSetting }
}

// 设置值
export function setLocalState(seting: SettingsState): void {
    ss.set(LOCAL_NAME, seting)
}

// 删除值
export function removeLocalState() {
    ss.remove(LOCAL_NAME)
}