'use client'
import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag, message, notification } from 'antd'
import type { TableProps } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import CreatePermissionModal from './create.role.modal'
import UpdatePermissionModal from './update.role.modal'
import { METHODS_COLOR } from '@/utils'
import { deletePermission } from '@/services/permission.service'
import { IPermission, IRole } from '@/types/backend'
import { deleteRole } from '@/services/role.service'

interface IProps {
    roles: IRole[]
    allPermissions: { [module: string]: IPermission[] }
    meta: {
        current: number
        pageSize: number
        total: number
    }
}

const PermissionsTable = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<any>(null)
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const router = useRouter()
    const pathname = usePathname()

    const columns: TableProps<IRole>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Role',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng Thái HĐ',
            dataIndex: 'active',
            key: 'active',
            render: (_, record) => {
                return (
                    <>
                        {record.active ? (
                            <Tag color={'blue'}>Hoạt động</Tag>
                        ) : (
                            <Tag color={'red'}>Không hoạt động</Tag>
                        )}
                    </>
                )
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size='small'>
                    <Button
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={() => {
                            setIsUpdateModalOpen(true)
                            setDataUpdate(record)
                        }}
                    />

                    <Popconfirm
                        placement='leftTop'
                        title={'Xác nhận xóa role'}
                        description={'Bạn có chắc chắn muốn xóa role này ?'}
                        onConfirm={() => handleDeleteRole(record)}
                        okText='Xác nhận'
                        cancelText='Hủy'
                    >
                        <Button danger type='primary' icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const { roles, meta, allPermissions } = props

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        if (pagination && pagination.current) {
            params.set('page', pagination.current)
            router.replace(`${pathname}?${params.toString()}`)
            setIsFetching(true)
        }
    }

    const onShowSizeChange = (current: any, pageSize: any) => {
        params.set('limit', pageSize + '')
        router.replace(`${pathname}?${params.toString()}`)
        setIsFetching(true)
    }

    const handleDeleteRole = async (role: any) => {
        const result = await deleteRole({ id: role.id })
        if (result.statusCode === 200) {
            if (meta.current > 1 && roles.length === 1) {
                params.set('page', `${meta.current - 1}`)
                router.replace(`${pathname}?${params.toString()}`)
                setIsFetching(true)
            }
            notification.success({
                message: result.message,
                placement: 'bottomRight',
            })
            return
        }
        if (result.statusCode === 400) {
            notification.error({
                message: result.message,
                placement: 'bottomRight',
            })
            return
        }
    }

    const renderHeader = () => {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    DANH SÁCH ROLE
                </Title>
                <Button
                    icon={<PlusOutlined />}
                    type='primary'
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm Role
                </Button>
            </div>
        )
    }

    useEffect(() => {
        if (roles) setIsFetching(false)
    }, [roles])

    return (
        <>
            <Table
                title={renderHeader}
                columns={columns}
                dataSource={roles}
                rowKey={'id'}
                loading={isFetching}
                onChange={onChange}
                pagination={{
                    ...meta,
                    onShowSizeChange,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]} - {range[1]} trên {total} rows
                            </div>
                        )
                    },
                }}
            />
            <CreatePermissionModal
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                allPermissions={allPermissions}
            />

            <UpdatePermissionModal
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                allPermissions={allPermissions}
            />
        </>
    )
}

export default PermissionsTable
