'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Col, Space, Card, Empty, Skeleton } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

import SearchCard from './card-search';
import DatasetCard from './card-dataset';
import DonutCard from './card-donut';

const { Content } = Layout;

export default function PageContent({ user_id }) {
    const [datasetList, setDatasetList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`);
            const data = response.data;
            return data.data[0];
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchDatasetList = async () => {
        try {
            const user = await fetchUserData();
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            const data = response.data;
            setDatasetList(data.data.filter((dataset) => (
                (dataset.permission_type === 'Private' && dataset.owner_id === user.user_id) ||
                (dataset.permission_type === 'Public') ||
                (dataset.permission_type === 'Faculty' && dataset.faculty_id === user.faculty_id) ||
                (dataset.permission_type === 'Unit' && dataset.unit_id === user.unit_id) ||
                (dataset.permission_type === 'Division' && dataset.division_id === user.division_id)
            )));
        } catch (error) {
            console.log('Error', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDatasetList();
    }, []);

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <Content style={{ padding: '24px' }}>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <SearchCard />
                </Col>
                <Col span={16}>
                    <Space direction='vertical' style={{ display: 'flex' }}>
                        <Card
                            title={<Space><EyeOutlined />Most Viewed Datasets</Space>}
                            extra={<Link href='/explore-dataset'>See all...</Link>}
                        >
                            { isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : datasetList.length === 0 ? <Empty /> :
                                datasetList.sort((a, b) => (b.view_count - a.view_count)).slice(0, 3).map((dataset) => (
                                    <Card.Grid key={dataset.dataset_id} style={{ width: '33.33%' }}>
                                        <DatasetCard dataset={dataset} type='view' />
                                    </Card.Grid>
                                ))
                            }
                        </Card>
                        <Card
                            title={<Space><DownloadOutlined />Most Exported Datasets</Space>}
                            extra={<Link href='/explore-dataset'>See all...</Link>}
                        >
                            { isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : datasetList.length === 0 ? <Empty /> :
                                datasetList.sort((a, b) => (b.export_count - a.export_count)).slice(0, 3).map((dataset) => (
                                    <Card.Grid key={dataset.dataset_id} style={{ width: '33.33%' }}>
                                        <DatasetCard dataset={dataset} type='export' />
                                    </Card.Grid>
                                ))
                            }
                        </Card>
                    </Space>
                </Col>
                <Col span={8}>
                    <DonutCard />
                </Col>
            </Row>
        </Content>
    );
}