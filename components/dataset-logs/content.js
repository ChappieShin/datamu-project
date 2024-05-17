'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Typography, Space, Table, Tag, Badge } from 'antd';
import { EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import StringAvatar from '../etc/avatar-string';

const { Content } = Layout;
const { Text } = Typography;

export default function PageContent() {
    const [logList, setLogList] = useState([]);

    const fetchLogList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`);
            const data = response.data;
            setLogList(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchLogList();
    }, []);

    const column_items = [
        {
            title: 'Log ID',
            dataIndex: 'log_id',
            key: 'log_id',
            sorter: {
                compare: (a, b) => (a.log_id - b.log_id),
                multiple: 1
            }
        },
        {
            title: 'Dataset ID',
            dataIndex: 'dataset_id',
            key: 'dataset_id',
            sorter: {
                compare: (a, b) => (a.dataset_id - b.dataset_id),
                multiple: 2
            }
        },
        {
            title: 'User',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <StringAvatar fname={record.fname} lname={record.lname} />
                    <Text type='secondary'>{`${record.fname} ${record.lname}`}</Text>
                </Space>
            ),
            sorter: {
                compare: (a, b) => {
                    if (a.fname.toLowerCase() !== b.fname.toLowerCase()) {
                        return a.fname.toLowerCase().localeCompare(b.fname.toLowerCase());
                    }
                    return a.lname.toLowerCase().localeCompare(b.lname.toLowerCase());
                },
                multiple: 3
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            filters: [
                {text: 'Admin', value: 'Admin'},
                {text: 'Staff', value: 'Staff'}
            ],
            onFilter: (value, record) => (record.role === value)
        },
        {
            title: 'Logged Date',
            dataIndex: 'log_date',
            key: 'log_date',
            render: (_, record) => (new Date(record.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })),
            sorter: {
                compare: (a, b) => {
                    const date_a = new Date(a.log_date);
                    const date_b = new Date(b.log_date);
                    return date_a - date_b;
                },
                multiple: 4
            }
        },
        {
            title: 'Action',
            dataIndex: 'log_type',
            key: 'log_type',
            align: 'center',
            render: (_, record) => (
                <Tag 
                    color={
                        record.log_type === 'VIEW' ? 'blue-inverse' :
                        record.log_type === 'CREATE' ? 'green-inverse' :
                        record.log_type === 'EDIT' ? 'gold-inverse' :
                        record.log_type === 'DELETE' ? 'red-inverse' :
                        record.log_type === 'EXPORT' ? 'purple-inverse' :
                        undefined
                    }
                    icon={
                        record.log_type === 'VIEW' ? <EyeOutlined /> :
                        record.log_type === 'CREATE' ? <PlusOutlined /> :
                        record.log_type === 'EDIT' ? <EditOutlined /> :
                        record.log_type === 'DELETE' ? <DeleteOutlined /> :
                        record.log_type === 'EXPORT' ? <DownloadOutlined /> :
                        undefined
                    }
                >
                    {record.log_type}
                </Tag>
            ),
            filters: [
                {text: 'VIEW', value: 'VIEW'},
                {text: 'CREATE', value: 'CREATE'},
                {text: 'EDIT', value: 'EDIT'},
                {text: 'DELETE', value: 'DELETE'},
                {text: 'EXPORT', value: 'EXPORT'},
            ],
            onFilter: (value, record) => (record.log_type === value)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <Badge
                    text={record.status}
                    status={
                        record.status === 'Success' ? 'success' : 
                        record.status === 'Failed' ? 'error' : 
                        undefined
                    }
                />
            ),
            filters: [
                {text: 'Success', value: 'Success'},
                {text: 'Failed', value: 'Failed'}
            ],
            onFilter: (value, record) => (record.status === value)
        },
        {
            title: 'Detail',
            dataIndex: 'detail',
            key: 'detail',
            align: 'center',
            render: (_, record) => (record.detail ? record.detail : '-')
        }
    ];
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <Content style={{ padding: '24px' }}>
            <Table
                columns={column_items}
                dataSource={logList}
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