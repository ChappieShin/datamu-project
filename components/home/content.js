'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Col, Space, Card, Empty } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

import SearchCard from './card-search';
import DatasetCard from './card-dataset';
import DonutCard from './card-donut';

const { Content } = Layout;

export default function PageContent() {
    const [datasetList, setDatasetList] = useState([]);

    const fetchDatasetList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            const data = response.data;
            setDatasetList(data.data.slice(0, 3));
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetList();
    }, []);

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
                            { datasetList.length === 0 ? <Empty /> :
                                datasetList.sort((a, b) => (b.view_count - a.view_count)).map((dataset) => (
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
                            { datasetList.length === 0 ? <Empty /> :
                                datasetList.sort((a, b) => (b.export_count - a.export_count)).map((dataset) => (
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