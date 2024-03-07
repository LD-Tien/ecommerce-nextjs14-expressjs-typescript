export interface IBackendRes<T> {
    error?: string | string[]
    message: string
    statusCode: number | string
    data?: T
}

export enum EMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export interface IPaginate<T> {
    meta: {
        current: number
        pageSize: number
        total: number
    }
    result: T[]
}

export interface IPermission {
    id: number
    name: string
    api: string
    method: EMethod
    module: string
    active: boolean
    description?: string
}

export interface IRole {
    id: number
    name: string
    active: boolean
    description?: string

    role_permission?: { role_id: number; permission_id: number }
}
