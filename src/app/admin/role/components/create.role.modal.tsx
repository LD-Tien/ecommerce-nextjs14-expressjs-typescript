import { createPermission } from '@/services/permission.service'
import { createRole } from '@/services/role.service'
import { IPermission } from '@/types/backend'
import { METHODS_COLOR } from '@/utils'
import { Modal, Input, Form, Row, Col, Switch, notification, Collapse, Flex, Tag } from 'antd'
import { useState } from 'react'

interface IProps {
    isCreateModalOpen: boolean
    allPermissions: { [module: string]: IPermission[] }
    setIsCreateModalOpen: (v: boolean) => void
}

const CreatePermissionModal = (props: IProps) => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { isCreateModalOpen, setIsCreateModalOpen, allPermissions } = props

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false)
    }

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

    const onFinish = async (values: any) => {
        const role_permission = values.role_permission
        const roleData = {
            name: values.name,
            active: values.active,
            description: values.description,
            role_permission: Object.keys(role_permission)
                .filter((module) => {
                    return role_permission[module]
                })
                .map((module) => {
                    return [
                        ...Object.keys(role_permission[module]).reduce<{ permission_id: number }[]>(
                            (acc, permissionId) => {
                                if (role_permission[module][permissionId]) {
                                    acc.push({
                                        permission_id: +permissionId,
                                    })
                                }
                                return acc
                            },
                            [],
                        ),
                    ]
                })
                .flat(),
        }
        setIsLoading(true)
        const result = await createRole(roleData)
        setIsLoading(false)
        if (result.statusCode === 200) {
            handleCloseCreateModal()
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

    return (
        <>
            <Modal
                title='Tạo Role'
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                getContainer={false}
                centered
                okText='Tạo'
                cancelText='Hủy'
                okButtonProps={{ loading: isLoading }}
                onCancel={() => handleCloseCreateModal()}
            >
                <Form name='create-role' onFinish={onFinish} layout='vertical' form={form}>
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

export default CreatePermissionModal
