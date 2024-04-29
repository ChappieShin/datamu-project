'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader() {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Admin'},
                        {title: <Link href='/apikey-management'>API Key Management</Link>},
                        {title: 'Generate API Key'}
                    ]}
                />
                <Title level={2} style={{ margin: 0 }}>Generate New API Key</Title>
            </Space>
        </Header>
    );
}