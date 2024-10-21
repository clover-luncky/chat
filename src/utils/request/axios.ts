import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
    baseURL: import.meta.env.VITE_GLOB_API_URL,
})

// 请求
service.interceptors.request.use((config) => {
    const token = useAuthStore().token
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error) => {
    return Promise.reject(error.response)
})

// 响应
service.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    if(response.status === 200) {
        return response
    }
    throw new Error(response.status.toString())
},(error) => {
    return Promise.reject(error)
})

export default service