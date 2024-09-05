import { defineStore } from "pinia";
import { getLocalState } from './helper'

export const useChatStore = defineStore('chat-store', {
    state: (): Chat.ChatState => getLocalState(),

    getters: {
        getChatHistoryByCurrentActive(state: Chat.ChatState) {
            const index = state.history.findIndex(item => item.uuid === state.active)
            return index !== -1 ? state.history[index] : null
        }
    },
    actions: {
        
    }
})