import { t } from '@/locales'
import { useChatStore } from '@/store'
import { useMessage } from 'naive-ui'
import { computed } from 'vue'

export function useUseingContext() {
    const ms = useMessage()
    const chatStore = useChatStore()
    const usingContext = computed<boolean>(() => chatStore.usingContext)
    
    function toggleUsingContext() {
        chatStore.setUsingContext(!usingContext.value)
        if(usingContext.value) {
            ms.success(t('chat.turnOnContext'))
        } else {
            ms.warning(t('chat.turnOffContext'))
        }
    }

    return {
        usingContext,
        toggleUsingContext
    }
}