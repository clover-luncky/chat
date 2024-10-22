import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "./helper";
import { store } from "@/store/helper";
import { fetchSession } from "@/api";


interface SessionResponse {
    auth: boolean
    model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
    token: string | undefined
    session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
    state: (): AuthState => ({
        token: getToken(),
        session: null
    }),
    getters: {
        isChatGPTAPI(state): boolean {
            return state.session?.model === 'ChatGPTAPI'
        }
    },
    actions: {
        // 获取session认证
        async getSession() {
            try {
                const { data } = await fetchSession<SessionResponse>()
                this.session = { ...data }
                return Promise.resolve(data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        setToken(token: string) {
            this.token = token
            setToken(token)
        },
        removeToken() {
            this.token = undefined
            removeToken()
        }
    }
})

export function useAuthStoreWithout() {
    return useAuthStore(store)
}