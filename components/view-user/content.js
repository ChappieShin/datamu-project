'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Col, Space, Typography, Card, Tag, Tooltip, Skeleton } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Text } = Typography;

export default function PageContent({ user_id }) {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`);
            const data = response.data;
            setUserData(data.data[0]);
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);
    
    return (
        <Content style={{ padding: '24px' }}>
            <Row justify='center'>
                <Card style={{ width: '40%' }}>
                    { isLoading ? <Skeleton active paragraph={{ rows: 7 }} /> :
                        <Row gutter={[0, 15]}>
                            <Col span={12}>
                                <Row>
                                    <Text strong>User ID:</Text>
                                </Row>
                                <Row>
                                    <Text type='secondary'>{userData.user_id}</Text>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Text strong>Username:</Text>
                                </Row>
                                <Row>
                                    <Text type='secondary'>{userData.username}</Text>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Text strong>First Name:</Text>
                                </Row>
                                <Row>
                                    <Text type='secondary'>{userData.fname}</Text>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Text strong>Last Name:</Text>
                                </Row>
                                <Row>
                                    <Text type='secondary'>{userData.lname}</Text>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Text strong>Email Address:</Text>
                                </Row>
                                <Row>
                                    <Text type='secondary'>{userData.email}</Text>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Text strong>Faculty:</Text>
                                </Row>
                                <Row>
                                    <Space>
                                        <Text type='secondary'>{userData.faculty_short + ' (' + userData.faculty_name + ')'}</Text>
                                        <Tooltip title={userData.faculty_name}>
                                            <Tag color={userData.faculty_color}>
                                                {userData.faculty_short}
                                            </Tag>
                                        </Tooltip>
                                    </Space>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Text strong>Unit:</Text>
                                </Row>
                                <Row>
                                    <Space>
                                        <Text type='secondary'>{userData.unit_short + ' (' + userData.unit_name + ')'}</Text>
                                        <Tooltip title={userData.unit_name}>
                                            <Tag>{userData.unit_short}</Tag>
                                        </Tooltip>
                                    </Space>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Text strong>Division:</Text>
                                </Row>
                                <Row>
                                    <Space>
                                        <Text type='secondary'>{userData.division_short + ' (' + userData.division_name + ')'}</Text>
                                        <Tooltip title={userData.division_name}>
                                            <Tag>{userData.division_short}</Tag>
                                        </Tooltip>
                                    </Space>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Text strong>Role:</Text>
                                </Row>
                                <Row>
                                    <Text type='secondary'>{userData.role}</Text>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Text strong>API Key:</Text>
                                </Row>
                                <Row>
                                    <Space>
                                        <Text type='secondary'>-</Text>
                                        {/* <Tooltip title='Manage API Key'>
                                            <Link href='#'>
                                                <SettingOutlined />
                                            </Link>
                                        </Tooltip> */}
                                    </Space>
                                </Row>
                            </Col>
                        </Row>
                    }
                </Card>
            </Row>
        </Content>
    );
}