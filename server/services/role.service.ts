import { PrismaClient } from '@prisma/client'
import { IRole } from '../models/role.model'

const prisma = new PrismaClient()

export const getRoles = async (
    offset: number = 0,
    limit: number = 5,
): Promise<{
    roles: IRole[]
    total: number
}> => {
    const roles = await prisma.role.findMany({
        orderBy: {
            id: 'desc',
        },
        skip: offset,
        take: limit,
        select: {
            id: true,
            name: true,
            active: true,
            description: true,
            role_permission: {
                select: {
                    role_id: true,
                    permission_id: true,
                    permission: true,
                },
            },
        },
    })

    const totalRoles = await prisma.role.count()

    return {
        roles: roles,
        total: totalRoles,
    }
}

export const createRole = async (role: IRole): Promise<IRole> => {
    const roleCreated = await prisma.role.create({
        data: {
            name: role.name,
            active: role.active,
            description: role.description,
            role_permission: {
                createMany: {
                    data: role.role_permission || [],
                },
            },
        },
        include: {
            role_permission: true,
        },
    })

    return roleCreated
}

export const updateRole = async (data: { id: number; dataUpdate: IRole }): Promise<IRole> => {
    const roleUpdated = await prisma.role.update({
        where: {
            id: data.id,
        },
        data: {
            name: data.dataUpdate.name,
            active: data.dataUpdate.active,
            description: data.dataUpdate.description,
            role_permission: {
                deleteMany: {},
                createMany: {
                    data: data.dataUpdate.role_permission || [],
                },
            },
        },
        include: {
            role_permission: true,
        },
    })

    return roleUpdated
}

export const deleteRole = async (id: number): Promise<IRole> => {
    const roleDeleted = await prisma.role.delete({ where: { id } })
    return roleDeleted
}

const roleService = {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
}

export default roleService
