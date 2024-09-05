import { useChatStore } from "../store"

export function useChat() {
    const chatStore = useChatStore()

    const addChat = () => {}
    return {
        addChat
    }
}