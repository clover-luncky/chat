import { useChatStore } from '@/store'
import { computed } from 'vue'

export function useUseingContext() {
    const chatStore = useChatStore()
    const usingContext = computed<boolean>(() => chatStore.usingContext)
    return {
        usingContext
    }
}