import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

// 定义用户信息参数
export interface UserInfo {
    avatar: string
    name: string
    description: string
}

// 包装用户信息
export interface UserState {
    userInfo: UserInfo
}

// 给默认的基本信息
export function defaultSetting(): UserState {
    return {
        userInfo: {
            avatar: 'https://avatars.githubusercontent.com/u/132592887?v=4',
            name: 'zhangsan',
            description: 'chat'
        }
    }
}

// 获取缓存返回用户信息参数
export function getLocalState(): UserState {
    const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
    return { ...defaultSetting(), ...localSetting }
}

// 设置用户缓存
export function setLocalState(setting: UserState):void {
    ss.set(LOCAL_NAME, setting)
}