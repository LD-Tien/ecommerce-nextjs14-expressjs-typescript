'use client'
import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag, message, notification } from 'antd'
import type { TableProps } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import CreatePermissionModal from './create.permission.modal'
import UpdatePermissionModal from './update.permission.modal'
import { METHODS_COLOR, MODULES } from '@/utils'
import { deletePermission } from '@/services/permission.service'
import { IPermission } from '@/types/backend'

interface IProps {
    permissions: IPermission[]
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

    const columns: TableProps<IPermission>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Permission',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Method',
            key: 'method',
            dataIndex: 'method',
            render: (_, { method }) => {
                return <Tag color={METHODS_COLOR[method]}>{method.toUpperCase()}</Tag>
            },
        },
        {
            title: 'API Path',
            dataIndex: 'api',
            key: 'api',
        },
        {
            title: 'Thuộc Module',
            dataIndex: 'module',
            key: 'module',
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
                        title={'Xác nhận xóa permission'}
                        description={'Bạn có chắc chắn muốn xóa permission này ?'}
                        onConfirm={() => handleDeletePermission(record)}
                        okText='Xác nhận'
                        cancelText='Hủy'
                    >
                        <Button danger type='primary' icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const data: IPermission[] = props.permissions
    const meta = props.meta

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

    const handleDeletePermission = async (permission: any) => {
        const result = await deletePermission({ id: permission.id })
        if (result.statusCode === 200) {
            if (meta.current > 1 && data.length === 1) {
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
                    DANH SÁCH PERMISSION
                </Title>
                <Button
                    icon={<PlusOutlined />}
                    type='primary'
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm Permission
                </Button>
            </div>
        )
    }

    useEffect(() => {
        if (data) setIsFetching(false)
    }, [data])

    return (
        <>
            <Table
                title={renderHeader}
                columns={columns}
                dataSource={data}
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
            />

            <UpdatePermissionModal
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default PermissionsTable
