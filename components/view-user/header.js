'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Layout, Row, Col, Space, Typography, Breadcrumb, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader({ user_id }) {
    const router = useRouter();

    const handleDeleteUser = async (user_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                router.push('/user-management');
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[
                        {title: 'Admin'},
                        {title: <Link href='/user-management'>User Management</Link>},
                        {title: user_id}
                    ]}
                />
                <Row justify='space-between'>
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>{`View User (${user_id})`}</Title>
                    </Col>
                    <Col>
                        <Space>
                            <Link href={`/user-management/${user_id}/edit`}>
                                <Button type='primary' icon={<EditOutlined />} style={{ backgroundColor: gold.primary }}>Edit</Button>
                            </Link>
                            <Popconfirm
                                title='Delete the user'
                                description='Are you sure to delete this user?'
                                onConfirm={() => handleDeleteUser(user_id)}
                            >
                                <Button type='primary' danger icon={<DeleteOutlined />}>Delete</Button>
                            </Popconfirm>
                        </Space>
                    </Col>
                </Row>
            </Space>
        </Header>
    );
}