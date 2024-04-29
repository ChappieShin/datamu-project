'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader({ tag_id }) {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb
                    items={[
                        {title: 'Admin'},
                        {title: <Link href='/tag-management'>Tag Management</Link>},
                        {title: tag_id},
                        {title: 'Edit Tag'}
                    ]}
                />
                <Title level={2} style={{ margin: 0 }}>{`Edit Tag (${tag_id})`}</Title>
            </Space>
        </Header>
    );
}