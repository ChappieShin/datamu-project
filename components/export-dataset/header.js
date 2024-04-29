'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader({ dataset_id }) {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Dataset'},
                        {title: <Link href='/explore-dataset'>Explore Dataset</Link>},
                        {title: <Link href={`/explore-dataset/${dataset_id}`}>{dataset_id}</Link>},
                        {title: 'Export Dataset'}
                    ]}
                />
                <Title level={2} style={{ margin: 0 }}>{`Export Dataset (${dataset_id})`}</Title>
            </Space>
        </Header>
    );
}