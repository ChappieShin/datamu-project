'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { Layout, Menu, Typography } from 'antd';
import {
    HomeOutlined,
    DatabaseOutlined,
    CompassOutlined,
    FolderOutlined,
    CustomerServiceOutlined,
    FolderOpenOutlined,
    TagsOutlined,
    TeamOutlined,
    ApiOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

export default function Sidebar({ role }) {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('home');

    const menu_items = [
        {type: 'divider'},
        {label: <Link href='/'>Home</Link>, key: 'home', icon: <HomeOutlined />},
        {
            label: 'Dataset',
            key: 'dataset',
            icon: <DatabaseOutlined />,
            children: [
                {label: <Link href='/explore-dataset'>Explore Dataset</Link>, key: 'explore_dataset', icon: <CompassOutlined />},
                {label: <Link href='/my-dataset'>My Dataset</Link>, key: 'my_dataset', icon: <FolderOutlined />}
            ]
        },
        role === 'Admin' && {
            label: 'Admin',
            key: 'admin',
            icon: <CustomerServiceOutlined />,
            children: [
                {label: <Link href='/dataset-management'>Dataset Management</Link>, key: 'dataset_mn', icon: <FolderOpenOutlined />},
                {label: <Link href='/tag-management'>Tag Management</Link>, key: 'tag_mn', icon: <TagsOutlined />},
                {label: <Link href='/user-management'>User Management</Link>, key: 'user_mn', icon: <TeamOutlined />},
                {label: <Link href='/apikey-management'>API Key Management</Link>, key: 'apikey_mn', icon: <ApiOutlined />}
            ]
        },
        {label: <Link href='/profile'>Profile</Link>, key: 'profile', icon: <UserOutlined />},
        {label: 'Logout', key: 'logout', icon: <LogoutOutlined />, onClick: () => (signOut({ callbackUrl: '/login' }))}
    ];

    return (
        <Sider
            width={240}
            theme='light'
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{ boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
                <Image src='/logo.png' alt='logo' width={42} height={42} />
                {!collapsed && 
                    <Title
                        level={3}
                        style={{
                            margin: '8px',
                            background: 'linear-gradient(to bottom, #2890E7, #4036CF)',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        Data.mu
                    </Title>
                }
            </div>
            <Menu
                mode='inline'
                selectedKeys={[current]}
                onClick={(value) => setCurrent(value.key)}
                items={menu_items}
            />
        </Sider>
    );
}