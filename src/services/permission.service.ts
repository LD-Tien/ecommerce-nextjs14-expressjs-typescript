'use server'
import { IBackendRes, IPaginate, IPermission } from '@/types/backend'
import { revalidateTag } from 'next/cache'

export const getPermissionsPaginate = async ({
    page,
    limit,
}: {
    page: number
    limit: number
}): Promise<IBackendRes<IPaginate<IPermission>>> => {
    const res = await fetch(
        `${process.env.HOST}:${process.env.PORT}/api/v1/permissions?page=${page}&limit=${limit}`,
        { next: { tags: ['list-permissions'] } },
    )
    const result = await res.json()
    if (result.statusCode === 400) {
        revalidateTag('list-permissions')
    }
    return result
}

export const getAllPermissions = async (): Promise<
    IBackendRes<{ [module: string]: IPermission[] }>
> => {
    const res = await fetch(`${process.env.HOST}:${process.env.PORT}/api/v1/permissions/all`, {
        next: { tags: ['list-all-permissions'] },
    })
    const result = await res.json()
    if (result.statusCode === 400) {
        revalidateTag('list-all-permissions')
    }
    return result
}

export const createPermission = async (data: any): Promise<IBackendRes<IPermission>> => {
    const res = await fetch(`${process.env.HOST}:${process.env.PORT}/api/v1/permissions`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
    })
    revalidateTag('list-permissions')
    revalidateTag('list-all-permissions')
    return await res.json()
}

export const updatePermission = async (data: any): Promise<IBackendRes<IPermission>> => {
    const res = await fetch(
        `${process.env.HOST}:${process.env.PORT}/api/v1/permissions/${data.id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
    revalidateTag('list-permissions')
    revalidateTag('list-all-permissions')
    return await res.json()
}

export const deletePermission = async (data: any): Promise<IBackendRes<IPermission>> => {
    const res = await fetch(
        `${process.env.HOST}:${process.env.PORT}/api/v1/permissions/${data.id}`,
        {
            method: 'DELETE',
        },
    )
    revalidateTag('list-permissions')
    revalidateTag('list-all-permissions')
    return await res.json()
}
