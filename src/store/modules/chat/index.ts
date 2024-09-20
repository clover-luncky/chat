import { defineStore } from "pinia";
import { getLocalState, setLocalState } from './helper'

export const useChatStore = defineStore('chat-store', {
    state: (): Chat.ChatState => getLocalState(),

    getters: {
        getChatHistoryByCurrentActive(state: Chat.ChatState) {
            const index = state.history.findIndex(item => item.uuid === state.active)
            return index !== -1 ? state.history[index] : null
        }
    },
    actions: {
        setUsingContext(context: boolean) {
            this.usingContext = context
            this.recordState()
        },
        // 更新缓存
        recordState() {
            setLocalState(this.$state)
        }
    }
})