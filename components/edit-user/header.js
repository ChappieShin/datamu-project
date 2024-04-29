'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader({ user_id }) {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Admin'},
                        {title: <Link href='/user-management'>User Management</Link>},
                        {title: <Link href={`/user-management/${user_id}`}>{user_id}</Link>},
                        {title: 'Edit User'}
                    ]}
                />
                <Title level={2} style={{ margin: 0 }}>{`Edit User (${user_id})`}</Title>
            </Space>
        </Header>
    );
}