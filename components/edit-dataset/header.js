'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb, Tabs } from 'antd';

const { Header } = Layout;
const { Title, Paragraph } = Typography;

export default function PageHeader({ dataset, tabs, onTabChange }) {
    return (
        <Header style={{ height: 'auto', padding: '24px 24px 0', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Dataset'},
                        {title: <Link href='/my-dataset'>My Dataset</Link>},
                        {title: <Link href={`/my-dataset/${dataset.dataset_id}`}>{dataset.dataset_id}</Link>},
                        {title: 'Edit Dataset'}
                    ]}
                />
                <Title level={2} style={{ margin: 0 }}>{`Edit Dataset (${dataset.title})`}</Title>
                <Paragraph />
                <Tabs items={tabs} onChange={onTabChange} />
            </Space>
        </Header>
    );
}