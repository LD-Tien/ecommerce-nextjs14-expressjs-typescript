import { PrismaClient } from '@prisma/client'
import { IPermission } from '../models/permission.model'

const prisma = new PrismaClient()

export const getPermissions = async (offset: number = 0, limit: number = 5) => {
    const permissions = await prisma.permission.findMany({
        orderBy: {
            id: 'desc',
        },
        skip: offset,
        take: limit,
    })
    const totalPermissions = await prisma.permission.count()
    return {
        permissions,
        totalPermissions,
    }
}

export const getAllPermissions = async (): Promise<Record<string, IPermission[]>> => {
    const permissions: IPermission[] = await prisma.permission.findMany()
    const permissionsByModule: Record<string, IPermission[]> = {}

    permissions.forEach((permission) => {
        const { module } = permission
        if (!permissionsByModule[module]) {
            permissionsByModule[module] = []
        }
        permissionsByModule[module].push(permission)
    })

    return permissionsByModule
}

export const createPermission = async (permission: any): Promise<IPermission> => {
    const permissionCreated = await prisma.permission.create({ data: permission })
    return permissionCreated
}

export const updatePermission = async (data: {
    id: number
    permission: IPermission
}): Promise<IPermission> => {
    const permissionUpdated = await prisma.permission.update({
        where: {
            id: data.id,
        },
        data: {
            ...data.permission,
        },
    })
    return permissionUpdated
}

export const deletePermission = async (id: number): Promise<IPermission> => {
    const permissionDeleted = await prisma.permission.delete({ where: { id } })
    return permissionDeleted
}

const permissionService = {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getAllPermissions,
}

export default permissionService
