'use server'

import PermissionsTable from '@/app/admin/role/components/view.roles.table'
import { redirect } from 'next/navigation'
import { getRoles } from '../../../services/role.service'
import { getAllPermissions } from '@/services/permission.service'

const RolesPage = async (props: any) => {
    if (!(props.searchParams.limit && props.searchParams.page)) {
        // default paginate
        redirect(`${process.env.HOST}:${process.env.PORT}/admin/role?page=1&limit=5`)
    }
    const limit = props.searchParams.limit
    const page = props.searchParams.page
    const result = await getRoles({ page, limit })
    const { data: allPermissions } = await getAllPermissions()

    if (result.statusCode === 400) {
        throw 'Xảy ra lỗi khi lấy thông tin role'
    }

    return (
        <PermissionsTable
            roles={result.data?.result || []}
            allPermissions={allPermissions || {}}
            meta={
                result.data?.meta || {
                    current: 1,
                    pageSize: 5,
                    total: 0,
                }
            }
        />
    )
}

export default RolesPage
