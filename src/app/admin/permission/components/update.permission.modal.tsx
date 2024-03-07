import { updatePermission } from '@/services/permission.service'
import { METHODS, MODULES } from '@/utils'
import { Modal, Input, Form, Row, Col, Switch, Select, notification } from 'antd'
import { useEffect, useState } from 'react'

interface IProps {
    isUpdateModalOpen: boolean
    setIsUpdateModalOpen: (v: boolean) => void
    dataUpdate: any
    setDataUpdate: any
}

const UpdatePermission = (props: IProps) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } = props
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                module: dataUpdate.module,
                description: dataUpdate.description,
                method: dataUpdate.method,
                active: dataUpdate.active,
                api: dataUpdate.api,
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
            const data = {
                id: dataUpdate.id,
                ...values,
            }
            setIsLoading(true)
            const result = await updatePermission(data)
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
            <Form name='update-permission' onFinish={onFinish} layout='vertical' form={form}>
                <Modal
                    title='Chỉnh Sửa Permission'
                    getContainer={false}
                    open={isUpdateModalOpen}
                    onOk={() => form.submit()}
                    onCancel={() => handleCloseUpdateModal()}
                    okText='Lưu'
                    okButtonProps={{ loading: isLoading }}
                    cancelText='Hủy'
                    maskClosable={false}
                >
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
                                <Input type='text' placeholder='/api/version/.../' />
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
                </Modal>
            </Form>
        </>
    )
}

export default UpdatePermission
