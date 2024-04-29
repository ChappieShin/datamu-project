'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Space, Table, Tooltip, Tag, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import TableHeader from './table-header';
import StringTag from '../etc/tag-string';

const { Content } = Layout;

export default function PageContent() {
    const [tagList, setTagList] = useState([]);

    const fetchTagList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
            const data = response.data.data.map((tag) => ({ ...tag, key: tag.tag_id }));
            setTagList(data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchTagList();
    }, []);

    const handleDeleteTag = async (tag_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tags/${tag_id}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                fetchTagList();
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
            title: 'Tag ID',
            dataIndex: 'tag_id',
            key: 'tag_id',
            sorter: {
                compare: (a, b) => (a.tag_id - b.tag_id),
                multiple: 1
            }
        },
        {
            title: 'Tag Name',
            dataIndex: 'tag_name',
            key: 'tag_name',
            render: (_, record) => (<StringTag name={record.tag_name} />),
            sorter: {
                compare: (a, b) => (a.tag_name.toLowerCase().localeCompare(b.tag_name.toLowerCase())),
                multiple: 2
            }
        },
        {
            title: 'Number of Datasets',
            dataIndex: 'Number of dataset(s)',
            key: 'Number of dataset(s)',
            sorter: {
                compare: (a, b) => (a['Number of dataset(s)'] - b['Number of dataset(s)']),
                multiple: 3
            }
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title='Edit'>
                        <Link href={`/tag-management/${record.tag_id}/edit`}>
                            <EditOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title='Delete'>
                        <Popconfirm
                            title='Delete the tag'
                            description='Are you sure to delete this tag?'
                            onConfirm={() => (handleDeleteTag(record.tag_id))}
                        >
                            <Link href='#'>
                                <DeleteOutlined />
                            </Link>
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <Content style={{ padding: '24px' }}>
            <Table
                columns={column_items}
                dataSource={tagList}
                title={() => (<TableHeader />)}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => (`Total ${total} items`)
                }}
            />
        </Content>
    );
}