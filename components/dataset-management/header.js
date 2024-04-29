'use client'

import { Layout, Space, Typography, Breadcrumb } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader() {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb items={[{title: 'Admin'}, {title: 'Dataset Management'}]} />
                <Title level={2} style={{ margin: 0 }}>Dataset Management</Title>
            </Space>
        </Header>
    );
}