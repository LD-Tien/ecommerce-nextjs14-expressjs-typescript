export interface IPermission {
    id: number
    name: string
    description: string | null
    method: string
    api: string
    module: string
    active: boolean
}
