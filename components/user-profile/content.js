'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Layout, Row, Col, Space, Typography, Card, Tag, Tooltip, Skeleton } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import StringAvatar from '../etc/avatar-string';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function PageContent({ user_id }) {
    const [userData, setUserData] = useState({});
    const [apiKey, setApiKey] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchApiKey = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/apikeys?user_id=${user_id}`);
            const data = response.data;
            setApiKey(data.data[0]);
        } catch (error) {
            console.log('Error', error);
        }
    };

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
        fetchApiKey();
    }, []);
    
    return (
        <Content style={{ padding: '24px' }}>
            <Row justify='center'>
                <Card style={{ width: '75%' }}>
                    { isLoading ? <Skeleton active paragraph={{ rows: 7 }} /> :
                    <Row>
                        <Card.Grid hoverable={false} style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Space direction='vertical'>
                                <Row justify='center'>
                                    <StringAvatar fname={userData.fname} lname={userData.lname} size={70} />
                                </Row>
                                <Row justify='center'>
                                    <Title level={4} style={{ margin: 0 }}>{userData.username}</Title>
                                </Row>
                                <Row justify='center'>
                                    <Text type='secondary'>{`(${userData.fname} ${userData.lname})`}</Text>
                                </Row>
                            </Space>
                        </Card.Grid>
                        <Card.Grid hoverable={false} style={{ width: '60%' }}>
                            <Row gutter={[0, 15]}>
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
                                        <Text strong>Role:</Text>
                                    </Row>
                                    <Row>
                                        <Text type='secondary'>{userData.role}</Text>
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
                                        <Text strong>
                                            <Space size={3}>
                                                API Key
                                                <Tooltip title={apiKey && `Expired Date: ${new Date(apiKey.expired_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}`}>
                                                    <QuestionCircleOutlined style={{ color: '#00000073' }} />
                                                </Tooltip>
                                                :
                                            </Space>
                                        </Text>
                                    </Row>
                                    <Row>
                                        <Space>
                                            <Text type='secondary' copyable={apiKey}>{apiKey ? apiKey.api_key : '-'}</Text>
                                        </Space>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Grid>
                    </Row>}
                </Card>
            </Row>
        </Content>
    );
}