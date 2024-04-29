'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Layout, Row, Col, Space, Typography, Divider, Breadcrumb, Statistic } from 'antd';
import CountUp from 'react-countup';
import StringAvatar from '../etc/avatar-string';

const { Header } = Layout;
const { Title, Paragraph } = Typography;

const formatter = (value) => <CountUp end={value} />;

export default function PageHeader({ user_id }) {
    const [userData, setUserData] = useState(null);
    const [numOwnedDataset, setNumOwnedDataset] = useState(0);
    const [numSharedDataset, setNumSharedDataset] = useState(0);
    const router = useRouter();
    
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`);
            const data = response.data;
            setUserData(data.data[0]);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchDatasetData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            const data= response.data;
            setNumOwnedDataset(data.data.filter((dataset) => (dataset.owner_id === user_id)).length);
            setNumSharedDataset(data.data.filter((dataset) => (dataset.owner_id !== user_id && dataset.permission_type === 'Public')).length);
        } catch (error) {
            console.log('Error', error);
        }
    };
    
    useEffect(() => {
        fetchUserData();
        fetchDatasetData();
        router.refresh();
    }, []);

    return ( userData &&
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb items={[{title: 'Home'}]} />
                <Title level={2} style={{ margin: 0 }}>Home</Title>
                <Row justify='space-between'>
                    <Col>
                        <Row gutter={15} align='middle'>
                            <Col>
                                <StringAvatar fname={userData.fname} lname={userData.lname} size={64} />
                            </Col>
                            <Col>
                                <Title level={4} style={{ margin: 0 }}>{`Welcome, ${userData.fname} ${userData.lname} 👋`}</Title>
                                <Paragraph type='secondary' style={{ margin: 0 }}>
                                    You're on a roll! Jump back in, start something new, or browse through available datasets and tools.
                                </Paragraph>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row gutter={24}>
                            <Col>
                                <Statistic title='Your Dataset(s)' value={numOwnedDataset} formatter={formatter} />
                            </Col>
                            <Col>
                                <Divider type='vertical' style={{ height: '100%' }} />
                            </Col>
                            <Col>
                                <Statistic title='Shared Dataset(s)' value={numSharedDataset} formatter={formatter} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Space>
        </Header>
    );
}