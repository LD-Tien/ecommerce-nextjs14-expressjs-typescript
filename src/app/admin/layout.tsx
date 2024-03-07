'use client'
import React, { useEffect, useState } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProductOutlined,
    UserOutlined,
    PieChartOutlined,
    ApartmentOutlined,
    ApiOutlined,
    ProfileOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, MenuProps } from 'antd'
import Link from 'next/link'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'

const { Header, Sider, Content } = Layout

const items: MenuProps['items'] = [
    {
        key: 'dashboard',
        icon: <PieChartOutlined />,
        label: <Link href={'/admin/dashboard'}>Dashboard</Link>,
    },
    {
        key: 'user',
        icon: <UserOutlined />,
        label: <Link href={'/admin/user'}>User</Link>,
    },
    {
        key: 'permission',
        icon: <ApiOutlined />,
        label: <Link href={'/admin/permission'}>Permission</Link>,
    },
    {
        key: 'role',
        icon: <ApartmentOutlined />,
        label: <Link href={'/admin/role'}>Role</Link>,
    },
    {
        key: 'product_manage',
        icon: <ProductOutlined />,
        label: 'Product',
        children: [
            {
                key: 'product',
                label: <Link href={'/admin/product'}>Product</Link>,
            },
            {
                key: 'variation',
                label: <Link href={'/admin/variation'}>variation</Link>,
            },
            {
                key: 'category',
                label: <Link href={'/admin/category'}>Category</Link>,
            },
        ],
    },
    {
        key: 'order',
        icon: <ProfileOutlined />,
        label: <Link href={'/admin/order'}>Order</Link>,
    },
]

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false)
    const router = useRouter()
    const segment = useSelectedLayoutSegment()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    useEffect(() => {}, [router])

    return (
        <Layout
            style={{
                height: '100vh',
            }}
        >
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ overflow: 'auto', height: '100vh', width: '300px' }}
            >
                <div className='demo-logo-vertical'></div>
                <Menu theme='dark' mode='inline' selectedKeys={[segment as string]} items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type='text'
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        overflow: 'auto',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminLayout
