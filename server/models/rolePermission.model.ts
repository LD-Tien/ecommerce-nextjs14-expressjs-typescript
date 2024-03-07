import { IPermission } from './permission.model'

export interface IRolePermission {
    role_id: number
    permission_id: number

    //prisma
    permission?: IPermission
}
