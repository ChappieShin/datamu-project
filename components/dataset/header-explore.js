'use client'

import Link from 'next/link';
import { Layout, Space, Typography, Breadcrumb, Tabs, Button, Dropdown } from 'antd';
import { ExperimentOutlined, TableOutlined, LineChartOutlined, DownloadOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title, Paragraph } = Typography;

export default function PageHeader({ dataset, tabs, onTabChange }) {
    return (
        <Header style={{ height: 'auto', padding: '24px 24px 0', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb
                    items={[
                        {title: 'Dataset'},
                        {title: <Link href='/explore-dataset'>Explore Dataset</Link>},
                        {title: dataset.dataset_id}
                    ]} 
                />
                <Title level={2} style={{ margin: 0 }}>{dataset.title}</Title>
                <Paragraph type='secondary'>{dataset.subtitle}</Paragraph>
                <Tabs
                    items={tabs}
                    onChange={onTabChange}
                    tabBarExtraContent={
                        <Space>
                            <Link href={`/explore-dataset/${dataset.dataset_id}/data-prep`}>
                                <Button icon={<TableOutlined />}>Data Preparation</Button>
                            </Link>
                            <Link href={`/explore-dataset/${dataset.dataset_id}/data-viz`}>
                                <Button icon={<LineChartOutlined />}>Data Visualization</Button>
                            </Link>
                            <Link href={`/explore-dataset/${dataset.dataset_id}/export`}>
                                <Button type='primary' icon={<DownloadOutlined />}>Export</Button>
                            </Link>
                        </Space>
                    }
                />
            </Space>
        </Header>
    );
}