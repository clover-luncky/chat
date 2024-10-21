import type { AxiosProgressEvent, GenericAbortSignal } from 'axios';
import { post } from '@/utils/request'
// 校验
export function fetchVerify<T>(token: string) {
    return post<T>({
        url: '/verify',
        data: { token }
    })
}