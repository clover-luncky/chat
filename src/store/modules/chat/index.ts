import { defineStore } from "pinia";
import { getLocalState, setLocalState, defaultState } from './helper'
import { t } from "@/locales";
import { router } from "@/router";

export const useChatStore = defineStore('chat-store', {
    state: (): Chat.ChatState => getLocalState(),

    getters: {
        // 获取历史活动的内容
        getChatHistoryByCurrentActive(state: Chat.ChatState) {
            const index = state.history.findIndex(item => item.uuid === state.active)
            return index !== -1 ? state.history[index] : null
        },
        // 获取聊天的uuid
        getChatByUuid(state: Chat.ChatState) {
            return (uuid?: number) => {
                if(uuid) {
                    return state.chat.find(item => item.uuid === uuid)?.data ?? []
                } else {
                    return state.chat.find(item => item.uuid === state.active)?.data ?? []
                }
            }
        }
    },
    actions: {
        setUsingContext(context: boolean) {
            this.usingContext = context
            this.recordState()
        },
        // 清除聊天的uuid
        clearChatByUuid(uuid: number) {
            if(!uuid || uuid === 0) {
                if(this.chat.length) {
                    this.chat[0].data = []
                    this.recordState()
                }
                return
            }

            const index = this.chat.findIndex(item => item.uuid === uuid)
            if(index > -1) {
                this.chat[index].data = []
                this.recordState()
            }
        },
        // 更新条件内容
        updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
            if(!uuid || uuid === 0) {
                if(this.chat.length) {
                    this.chat[0].data[index] = chat
                    this.recordState()
                }
                return
            }
            const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
            if(chatIndex !== -1) {
                this.chat[chatIndex].data[index] = chat
                this.recordState()
            }
        },
        // 添加聊天记录
        addChatByUuid(uuid: number, chat: Chat.Chat) {
            if(!uuid || uuid === 0) {
                if(this.history.length === 0) {
                    const uuid = Date.now()
                    this.history.push({ uuid, title: chat.text, isEdit: false })
                    this.chat.push({ uuid, data: [chat] })
                    this.active = uuid
                    this.recordState()
                } else {
                    this.chat[0].data.push(chat)
                    if(this.history[0].title === t('chat.newChatTitle')) {
                        this.history[0].title = chat.text
                    }
                    this.recordState()
                }
            }

            const index = this.chat.findIndex(item => item.uuid === uuid)
            if(index !== -1) {
                this.chat[index].data.push(chat)
                if(this.history[index].title === t('chat.newChatTitle')) {
                    this.history[index].title = chat.text
                }
                this.recordState()
            }
        },
        // 更新聊天内容
        updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
          if(!uuid || uuid === 0) {
            if(this.chat.length) {
                this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
                this.recordState()
            }
            return
          }  
          const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
          if(chatIndex !== -1) {
            this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ... chat }
            this.recordState()
          }
        },
        // 获取聊天内容
        getChatByUuidAndIndex(uuid: number, index: number) {
            if(!uuid || uuid === 0) {
                if(this.chat.length) {
                    return this.chat[0].data[index]
                }
                return null
            }
            const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
            if(chatIndex > -1) {
                return this.chat[chatIndex].data[index]
            }
            return null
        },
        // 添加历史记录
        addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
            this.history.unshift(history)
            this.chat.unshift({ uuid: history.uuid, data: chatData })
            this.active = history.uuid
            this.reloadRoute(history.uuid)
        },
        // 路由跳转
        async reloadRoute(uuid?: number) {
          this.recordState()
          await router.push({ name: 'Chat', params: { uuid } })  
        },
        // 清除历史记录
        clearHistory() {
            this.$state = { ...defaultState() }
            this.recordState()
        },
        // 更新历史记录
        updateHistory(uuid: number, edit: Partial<Chat.History>) {
            const index = this.history.findIndex(item => item.uuid === uuid)
            if(index > -1) {
                this.history[index] = { ...this.history[index], ...edit }
                this.recordState()
            }
        },
        // 设置活动状态
        async setActive(uuid: number) {
            this.active = uuid
            return await this.reloadRoute(uuid)
        },
        // 删除历史记录
        deleteHistory(index: number) {
            this.history.splice(index, 1)
            this.chat.splice(index, 1)
            if(this.history.length === 0) {
                this.active = null
                this.reloadRoute()
                return
            }
            if(index > 0 && index <= this.history.length) {
                const uuid = this.history[index - 1].uuid
                this.active = uuid
                this.reloadRoute(uuid)
                return
            }
            if(index === 0 && this.history.length > 0) {
                const uuid = this.history[0].uuid
                this.active = uuid
                this.reloadRoute(uuid)
            }
            if(index > this.history.length) {
                const uuid = this.history[this.history.length - 1].uuid
                this.active = uuid
                this.reloadRoute(uuid)
            }
        },
        // 更新缓存
        recordState() {
            setLocalState(this.$state)
        }
    }
})