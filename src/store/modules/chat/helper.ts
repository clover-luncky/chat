const LOCAL_NAME = 'chatStorage'
export function defaultState(): Chat.ChatState {
    const uuid = 1002
    return {
        active: uuid,
        usingContext: true,
        history: [{
            uuid,
            title: 'chat.newChatTitle',
            isEdit: false
        }],
        chat: [{
            uuid,
            data: []
        }]
    }
}

export function getLocalState(): Chat.ChatState {
    const localState = LOCAL_NAME
    return {
        ...defaultState()
    }
}