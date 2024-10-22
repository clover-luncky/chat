import type { AxiosProgressEvent, GenericAbortSignal } from 'axios';
import { post } from '@/utils/request'
import { useAuthStore, useSettingsStore } from '@/store';
// 校验
export function fetchVerify<T>(token: string) {
    return post<T>({
        url: '/verify',
        data: { token }
    })
}

// 获取配置信息
export function fetchChatConfig<T = any>() {
    return post<T>({
        url: '/config'
    })
}

// 获取session信息
export function fetchSession<T>() {
    return post<T>({
        url: '/session'
    })
}

export function fetchChatAPIProcess<T = any>(
    params: {
        prompt: string
        options?: { conversationId?: string; parentMessageId?: string }
        signal?: GenericAbortSignal
        onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
    }
) {
    const settingStore = useSettingsStore()
    const authStore = useAuthStore()
    
    let data: Record<string, any> = {
        prompt: params.prompt,
        options: params.options
    }
    
    if(authStore.isChatGPTAPI) {
        data = {
            ...data,
            systemMessage: settingStore.systemMessage,
            temperature: settingStore.temperature,
            top_p: settingStore.top_p
        }
    }
    
    return post<T>({
        url: '/chat-process',
        data,
        signal: params.signal,
        onDownloadProgress: params.onDownloadProgress
    })
}