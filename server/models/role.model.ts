import { IRolePermission } from './rolePermission.model'

export interface IRole {
    id: number
    name: string
    active: boolean
    description?: string | null

    //prisma
    role_permission?: IRolePermission[]
}
