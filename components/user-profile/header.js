'use client'

import Link from 'next/link';
import { Layout, Row, Col, Space, Typography, Breadcrumb, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors'

const { Header } = Layout;
const { Title } = Typography;

export default function PageHeader() {
    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb 
                    items={[{title: 'Profile'}]}
                />
                <Row justify='space-between'>
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>User Profile</Title>
                    </Col>
                    <Col>
                        <Link href={`/profile/edit`}>
                            <Button type='primary' icon={<EditOutlined />} style={{ backgroundColor: gold.primary }}>Edit Profile</Button>
                        </Link>
                    </Col>
                </Row>
            </Space>
        </Header>
    );
}