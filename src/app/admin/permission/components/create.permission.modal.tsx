import { createPermission } from '@/services/permission.service'
import { IPermission } from '@/types/backend'
import { METHODS, MODULES } from '@/utils'
import { Modal, Input, Form, Row, Col, message, Select, Switch, notification } from 'antd'
import { useEffect, useState } from 'react'

interface IProps {
    isCreateModalOpen: boolean
    setIsCreateModalOpen: (v: boolean) => void
}

const CreatePermissionModal = (props: IProps) => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { isCreateModalOpen, setIsCreateModalOpen } = props

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false)
    }

    const onFinish = async (values: IPermission) => {
        setIsLoading(true)
        const result = await createPermission(values)
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

    useEffect(() => {
        if (isCreateModalOpen) {
            form.setFieldsValue({ method: 'GET', module: 'USER', active: true })
        }
    }, [form, isCreateModalOpen])

    return (
        <>
            <Modal
                title='Tạo Permission'
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                okText='Tạo'
                cancelText='Hủy'
                okButtonProps={{ loading: isLoading }}
                onCancel={() => handleCloseCreateModal()}
                maskClosable={false}
            >
                <Form name='create-permission' onFinish={onFinish} layout='vertical' form={form}>
                    <Row gutter={[12, 12]}>
                        <Col span={24} md={12}>
                            <Form.Item
                                label='Tên permission'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập tên permission!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                label='Thuộc module'
                                name='module'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn module!',
                                    },
                                ]}
                            >
                                <Select
                                    options={MODULES.map((module) => {
                                        return { label: module, value: module }
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 12]}>
                        <Col span={24} md={12}>
                            <Form.Item
                                label='Method'
                                name='method'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn method!',
                                    },
                                ]}
                            >
                                <Select
                                    options={METHODS.map((method) => {
                                        return { label: method, value: method }
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                label='API path'
                                name='api'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập API path!',
                                    },
                                ]}
                            >
                                <Input type='text' />
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
                            <Form.Item label='Trạng thái hoạt động' name='active'>
                                <Switch
                                    checkedChildren='Hoạt động'
                                    unCheckedChildren='Không hoạt động'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default CreatePermissionModal
