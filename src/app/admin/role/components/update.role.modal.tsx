import { updateRole } from '@/services/role.service'
import { IPermission } from '@/types/backend'
import { METHODS_COLOR, MODULES } from '@/utils'
import { Modal, Input, Form, Row, Col, Switch, notification, Collapse, Flex, Tag } from 'antd'
import { useEffect, useState } from 'react'

interface IProps {
    isUpdateModalOpen: boolean
    setIsUpdateModalOpen: (v: boolean) => void
    dataUpdate: any
    setDataUpdate: any
    allPermissions: { [module: string]: IPermission[] }
}

const UpdatePermission = (props: IProps) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, allPermissions } =
        props
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    const handleOnChangeSignSwitch = (checked: boolean, module: string) => {
        if (!checked) {
            const permissions = form.getFieldsValue()['role_permission'][module]
            const turnOffGroup = Object.keys(permissions).every(
                (v) => permissions[v] == false || permissions[v] == undefined,
            )
            if (turnOffGroup)
                // turn off switch group
                form.setFieldsValue({
                    ['role_permission']: {
                        [module]: !turnOffGroup,
                    },
                })
        }
    }

    const handleOnChangeGroupSwitch = (checked: boolean, module: string) => {
        if (checked)
            allPermissions[module].forEach((permission) => {
                form.setFieldsValue({
                    ['role_permission']: {
                        [module]: {
                            [permission.id]: true,
                        },
                    },
                })
            })
    }

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                active: dataUpdate.active,
                description: dataUpdate.description,
                role_permission: MODULES.reduce((acc: any, module: any) => {
                    const temp = dataUpdate.role_permission.reduce(
                        (acc: any, role_permission: any) => {
                            if (module === role_permission.permission.module) {
                                acc[role_permission.permission_id] = true
                            }
                            return acc
                        },
                        {},
                    )
                    if (Object.keys(temp).length !== 0) {
                        acc[module] = temp
                    }
                    return acc
                }, {}),
            })
        }
    }, [dataUpdate, form])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false)
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const role_permission = values.role_permission
            const data = {
                id: dataUpdate.id,
                name: values.name,
                active: values.active,
                description: values.description,
                role_permission: Object.keys(role_permission)
                    .filter((module) => {
                        return role_permission[module]
                    })
                    .map((module) => {
                        return [
                            ...Object.keys(role_permission[module]).reduce<
                                { permission_id: number }[]
                            >((acc, permissionId) => {
                                if (role_permission[module][permissionId]) {
                                    acc.push({
                                        permission_id: +permissionId,
                                    })
                                }
                                return acc
                            }, []),
                        ]
                    })
                    .flat(),
            }
            setIsLoading(true)
            const result = await updateRole(data)
            setIsLoading(false)
            if (result.statusCode === 200) {
                handleCloseUpdateModal()
                notification.success({
                    message: result.message,
                    placement: 'bottomRight',
                })
            } else if (result.statusCode === 400) {
                notification.error({
                    message: result.message,
                    placement: 'bottomRight',
                })
            }
        }
    }

    return (
        <>
            <Modal
                title='Chỉnh Sửa Role'
                open={isUpdateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseUpdateModal()}
                okText='Lưu'
                okButtonProps={{ loading: isLoading }}
                cancelText='Hủy'
                centered
                maskClosable={false}
            >
                <Form name='update-role' onFinish={onFinish} layout='vertical' form={form}>
                    <Row gutter={[12, 12]}>
                        <Col span={24} md={14}>
                            <Form.Item
                                label='Tên role'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập tên role!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={10}>
                            <Form.Item label='Trạng thái hoạt động' name='active'>
                                <Switch
                                    checkedChildren='Hoạt động'
                                    unCheckedChildren='Không hoạt động'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 12]}>
                        <Col span={24} md={24}>
                            <Form.Item label='Mô tả' name='description'>
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 12]}>
                        <Col span={24} md={24}>
                            <p>Chọn permission</p>
                            <Collapse
                                accordion
                                items={Object.keys(allPermissions).map((module) => {
                                    return {
                                        key: module,
                                        label: (
                                            <Flex justify='space-between'>
                                                <span>{module}</span>
                                                <Form.Item
                                                    noStyle
                                                    name={['role_permission', module]}
                                                >
                                                    <Switch
                                                        onClick={(_, event) => {
                                                            event.stopPropagation()
                                                        }}
                                                        onChange={(checked) => {
                                                            handleOnChangeGroupSwitch(
                                                                checked,
                                                                module,
                                                            )
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Flex>
                                        ),
                                        children: allPermissions[module].map(
                                            (permission: IPermission) => {
                                                return (
                                                    <Flex vertical gap={8} key={permission.id}>
                                                        <Flex
                                                            justify='space-between'
                                                            align='center'
                                                        >
                                                            <div>
                                                                <Tag
                                                                    color={
                                                                        METHODS_COLOR[
                                                                            permission.method
                                                                        ]
                                                                    }
                                                                >
                                                                    {permission.method}
                                                                </Tag>
                                                                <span>{permission.api}</span>
                                                                <p>{permission.name}</p>
                                                            </div>
                                                            <Form.Item
                                                                noStyle
                                                                name={[
                                                                    'role_permission',
                                                                    module,
                                                                    permission.id + '',
                                                                ]}
                                                            >
                                                                <Switch
                                                                    onChange={(checked) => {
                                                                        handleOnChangeSignSwitch(
                                                                            checked,
                                                                            module,
                                                                        )
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Flex>
                                                    </Flex>
                                                )
                                            },
                                        ),
                                    }
                                })}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default UpdatePermission
