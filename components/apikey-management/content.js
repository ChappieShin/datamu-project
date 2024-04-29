'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Space, Typography, Table, Tooltip, Badge, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import TableHeader from './table-header';
import StringAvatar from '../etc/avatar-string';

const { Content } = Layout;
const { Text } = Typography;

export default function PageContent() {
    const [apiKeyList, setApiKeyList] = useState([]);

    const fetchApiKeyList = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/apikeys');
            const data = response.data.data.map((key) => ({ ...key, key: key.key_id, status: new Date() > new Date(key.expired_date) ? 'Expired' : 'Active' }));
            setApiKeyList(data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchApiKeyList();
    }, []);

    const handleDeleteApiKey = async (key_id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/apikeys/${key_id}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                fetchApiKeyList();
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    const column_items = [
        {
            title: 'Key ID',
            dataIndex: 'key_id',
            key: 'key_id',
            sorter: {
                compare: (a, b) => (a.key_id - b.key_id),
                multiple: 1
            }
        },
        {
            title: 'API Key',
            dataIndex: 'api_key',
            key: 'api_key',
            sorter: {
                compare: (a, b) => (a.api_key.toLowerCase().localeCompare(b.api_key.toLowerCase())),
                multiple: 2
            }
        },
        {
            title: 'Assigned To',
            key: 'assigned_to',
            render: (_, record) => (
                <Space>
                    <StringAvatar fname={record.assigned_to_fname} lname={record.assigned_to_lname} />
                    <Text type='secondary'>{`${record.assigned_to_fname} ${record.assigned_to_lname}`}</Text>
                </Space>
            ),
            sorter: {
                compare: (a, b) => {
                    if (a.assigned_to_fname.toLowerCase() !== b.assigned_to_fname.toLowerCase()) {
                        return a.assigned_to_fname.toLowerCase().localeCompare(b.assigned_to_fname.toLowerCase());
                    }
                    return a.assigned_to_lname.toLowerCase().localeCompare(b.assigned_to_lname.toLowerCase());
                },
                multiple: 3
            }
        },
        {
            title: 'Assigned By',
            key: 'assigned_by',
            render: (_, record) => (
                <Space>
                    <StringAvatar fname={record.assigned_by_fname} lname={record.assigned_by_lname} />
                    <Text type='secondary'>{`${record.assigned_by_fname} ${record.assigned_by_lname}`}</Text>
                </Space>
            ),
            sorter: {
                compare: (a, b) => {
                    if (a.assigned_by_fname.toLowerCase() !== b.assigned_by_fname.toLowerCase()) {
                        return a.assigned_by_fname.toLowerCase().localeCompare(b.assigned_by_fname.toLowerCase());
                    }
                    return a.assigned_by_lname.toLowerCase().localeCompare(b.assigned_by_lname.toLowerCase());
                },
                multiple: 3
            }
        },
        {
            title: 'Generated Date',
            dataIndex: 'generated_date',
            key: 'generated_date',
            render: (_, record) => (new Date(record.generated_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })),
            sorter: {
                compare: (a, b) => {
                    const date_a = new Date(a.generated_date);
                    const date_b = new Date(b.generated_date);
                    return date_a - date_b;
                },
                multiple: 4
            }
        },
        {
            title: 'Expired Date',
            dataIndex: 'expired_date',
            key: 'expired_date',
            render: (_, record) => (new Date(record.expired_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })),
            sorter: {
                compare: (a, b) => {
                    const date_a = new Date(a.expired_date);
                    const date_b = new Date(b.expired_date);
                    return date_a - date_b;
                },
                multiple: 4
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (<Badge text={record.status} status={record.status === 'Active' ? 'processing' : 'error'} />),
            filters: [
                {text: 'Active', value: 'Active'},
                {text: 'Expired', value: 'Expired'}
            ],
            onFilter: (value, record) => (record.status === value)
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Tooltip title='Delete'>
                    <Popconfirm
                        title='Delete the API Key'
                        description='Are you sure to delete this API key?'
                        onConfirm={() => (handleDeleteApiKey(record.key_id))}
                    >
                        <Link href='#'>
                            <DeleteOutlined />
                        </Link>
                    </Popconfirm>
                </Tooltip>
            )
        }
    ];

    return (
        <Content style={{ padding: '24px' }}>
            <Table
                columns={column_items}
                dataSource={apiKeyList}
                title={() => (<TableHeader />)}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => (`Total ${total} items`)
                }}
                scroll={{ x: 'max-content' }}
            />
        </Content>
    );
}