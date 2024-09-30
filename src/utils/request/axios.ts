import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
    baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use((config) => {
    const token = useAuthStore().token
    
})