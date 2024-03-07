'use server'

import PermissionsTable from '@/app/admin/permission/components/view.permissions.table'
import { redirect } from 'next/navigation'
import { getPermissionsPaginate } from '../../../services/permission.service'

const PermissionsPage = async (props: any) => {
    if (!(props.searchParams.limit && props.searchParams.page)) {
        // default paginate
        redirect(`${process.env.HOST}:${process.env.PORT}/admin/permission?page=1&limit=5`)
    }
    const limit = props.searchParams.limit
    const page = props.searchParams.page
    const result = await getPermissionsPaginate({ page, limit })

    if (result.statusCode === 400) {
        throw 'Xảy ra lỗi khi lấy thông tin permission'
    }

    return (
        <PermissionsTable
            permissions={result.data?.result || []}
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

export default PermissionsPage
