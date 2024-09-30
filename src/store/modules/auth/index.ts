import { defineStore } from "pinia";
import { getToken } from "./helper";
import { Session } from "inspector";

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
        async getSession() {
            try {
                const {} = await fetchSession<SessionResponse>()
            } catch (error) {
                return Promise.reject(error)
            }
        }
    }
})