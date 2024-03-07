'use server'
import { IBackendRes, IPaginate, IRole } from '@/types/backend'
import { revalidateTag } from 'next/cache'

export const getRoles = async ({
    page,
    limit,
}: {
    page: number
    limit: number
}): Promise<IBackendRes<IPaginate<IRole>>> => {
    const res = await fetch(
        `${process.env.HOST}:${process.env.PORT}/api/v1/roles?page=${page}&limit=${limit}`,
        { next: { tags: ['list-roles'] } },
    )
    const result = await res.json()
    if (result.statusCode === 400) {
        revalidateTag('list-roles')
    }
    return result
}

export const createRole = async (data: any): Promise<IBackendRes<IRole>> => {
    const res = await fetch(`${process.env.HOST}:${process.env.PORT}/api/v1/roles`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
    })
    revalidateTag('list-roles')
    return await res.json()
}

export const updateRole = async (data: any): Promise<IBackendRes<IRole>> => {
    const res = await fetch(`${process.env.HOST}:${process.env.PORT}/api/v1/roles/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    revalidateTag('list-roles')
    return await res.json()
}

export const deleteRole = async (data: any): Promise<IBackendRes<IRole>> => {
    const res = await fetch(`${process.env.HOST}:${process.env.PORT}/api/v1/roles/${data.id}`, {
        method: 'DELETE',
    })
    revalidateTag('list-roles')
    return await res.json()
}
