import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const totalPermission = await prisma.permission.count()
    const totalRoles = await prisma.role.count()
    const totalRolesPermissions = await prisma.role_permission.count()
    if (totalPermission === 0) {
        await prisma.permission.createMany({
            data: [
                {
                    id: 1,
                    name: 'Read permissions',
                    description: '',
                    method: 'GET',
                    api: '/api/v1/permissions',
                    active: true,
                    module: 'PERMISSION',
                },
                {
                    id: 2,
                    name: 'Add a permission',
                    description: '',
                    method: 'POST',
                    api: '/api/v1/permissions/:id',
                    active: true,
                    module: 'PERMISSION',
                },
                {
                    id: 3,
                    name: 'Update a permission',
                    description: '',
                    method: 'PUT',
                    api: '/api/v1/permissions/:id',
                    active: true,
                    module: 'PERMISSION',
                },
                {
                    id: 4,
                    name: 'Delete a permission',
                    description: '',
                    method: 'DELETE',
                    api: '/api/v1/permissions/:id',
                    active: true,
                    module: 'PERMISSION',
                },
            ],
        })
    }
    if (totalRoles === 0) {
        await prisma.role.createMany({
            data: [
                {
                    id: 1,
                    name: 'USER',
                    active: true,
                },
                {
                    id: 2,
                    name: 'ADMIN',
                    active: true,
                },
                {
                    id: 3,
                    name: 'EMPLOYER',
                    active: true,
                },
                {
                    id: 4,
                    name: 'GUEST',
                    active: true,
                },
            ],
        })
    }
    if (totalRolesPermissions === 0 && totalPermission === 0 && totalRoles === 0) {
        await prisma.role_permission.createMany({
            data: [
                { role_id: 2, permission_id: 1 },
                { role_id: 2, permission_id: 2 },
                { role_id: 2, permission_id: 3 },
                { role_id: 2, permission_id: 4 },
            ],
        })
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
