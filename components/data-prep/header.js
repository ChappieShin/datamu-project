'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader({ dataset }) {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Dataset'},
                        {title: <Link href='/explore-dataset'>Explore Dataset</Link>},
                        {title: <Link href={`/explore-dataset/${dataset.dataset_id}`}>{dataset.dataset_id}</Link>},
                        {title: 'Data Preparation'}
                    ]}
                />
                <Title level={2} style={{ margin: 0 }}>{`Data Preparation (${dataset.title})`}</Title>
            </Space>
        </Header>
    );
}