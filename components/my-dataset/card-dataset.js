import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { Row, Col, Space, Typography, Card, Tooltip, Tag, Popconfirm, Badge, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { filesize } from 'filesize';
import abbreviate from 'number-abbreviate';
import StringAvatar from '../etc/avatar-string';
import StringTag from '../etc/tag-string';

const { Text } = Typography;

export default function DatasetCard({ dataset, fetchDatasetList }) {
    const { data: session, status } = useSession();
    
    const handleDeleteDataset = async (dataset_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${dataset_id}?user_id=${session.user.name}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                fetchDatasetList();
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <Badge.Ribbon text={dataset.faculty_short} color={dataset.faculty_color} style={{ marginTop: '45px' }}>
            <Card
                size='small'
                hoverable
                title={
                    <Text>
                        {dataset.title}
                        <Text type='secondary' style={{ fontWeight: 'normal' }}>
                            {` (${dataset.num_tables} Tables · ${filesize(dataset.total_size)})`}
                        </Text>
                    </Text>
                }
                extra={
                    <Space>
                        <Tooltip title='Edit'>
                            <Link href={`/my-dataset/${dataset.dataset_id}/edit`}>
                                <EditOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip title='Delete'>
                            <Popconfirm
                                title='Delete the dataset'
                                description='Are you sure to delete this dataset?'
                                onConfirm={() => (handleDeleteDataset(dataset.dataset_id))}
                            >
                                <Link href='#'>
                                    <DeleteOutlined />
                                </Link>
                            </Popconfirm>
                        </Tooltip>
                        <Link href={`/my-dataset/${dataset.dataset_id}`}>
                            More...
                        </Link>
                    </Space>
                }
            >
                <Link href={`/my-dataset/${dataset.dataset_id}`}>
                    <Space direction='vertical' style={{ display: 'flex' }}>
                        <Text ellipsis={{ rows: 1 }}>{dataset.subtitle}</Text>
                        <Row justify='space-between' align='middle'>
                            <Col>
                                <Row gutter={5} align='middle'>
                                    <Col>
                                        <Text type='secondary'>Owner:</Text>
                                    </Col>
                                    <Col>
                                        <StringAvatar fname={dataset.fname} lname={dataset.lname} />
                                    </Col>
                                    <Col>
                                        <Text type='secondary'>{dataset.fname + ' ' + dataset.lname}</Text>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Text type='secondary'>
                                    {`Last modified: ${new Date(dataset.modified_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                </Text>
                            </Col>
                        </Row>
                        <Row justify='space-between'>
                            <Col>
                                {dataset.tags && dataset.tags.split(',').map((tag) => (<StringTag name={tag} />))}
                            </Col>
                            <Col>
                                <Space size='middle'>
                                    <Tooltip title='Total Views'>
                                        <Space>
                                            <EyeOutlined style={{ color: '#00000073' }} />
                                            <Text type='secondary'>{`${abbreviate(dataset.view_count, 1)} views`}</Text>
                                        </Space>
                                    </Tooltip>
                                    <Tooltip title='Total Exports'>
                                        <Space>
                                            <DownloadOutlined style={{ color: '#00000073' }} />
                                            <Text type='secondary'>{`${abbreviate(dataset.export_count, 1)} times`}</Text>
                                        </Space>
                                    </Tooltip>
                                </Space>
                            </Col>
                        </Row>
                    </Space>
                </Link>
            </Card>
        </Badge.Ribbon>
    );
}