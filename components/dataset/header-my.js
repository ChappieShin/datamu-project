'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Layout, Space, Typography, Breadcrumb, Tabs, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

const { Header } = Layout;
const { Title, Paragraph } = Typography;

export default function PageHeader({ dataset, tabs, onTabChange }) {
    const router = useRouter();

    const handleDeleteDataset = async (dataset_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${dataset_id}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                router.push('/my-dataset');
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };
    
    return (
        <Header style={{ height: 'auto', padding: '24px 24px 0', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Dataset'},
                        {title: <Link href='/my-dataset'>My Dataset</Link>},
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
                            <Link href={`/my-dataset/${dataset.dataset_id}/edit`}>
                                <Button type='primary' icon={<EditOutlined />} style={{ backgroundColor: gold.primary }}>Edit</Button>
                            </Link>
                            <Popconfirm
                                title='Delete the dataset'
                                description='Are you sure to delete this dataset?'
                                onConfirm={() => (handleDeleteDataset(dataset.dataset_id))}
                            >
                                <Button type='primary' danger icon={<DeleteOutlined />}>Delete</Button>
                            </Popconfirm>
                        </Space>
                    }
                />
            </Space>
        </Header>
    );
}