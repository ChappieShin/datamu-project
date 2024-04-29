'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Space, Table, Tooltip, Tag, Popconfirm, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import TableHeader from './table-header';
import StringAvatar from '../etc/avatar-string';

const { Content } = Layout;

export default function PageContent() {
    const [userList, setUserList] = useState([]);

    const fetchUserList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
            const data = response.data.data.map((user) => ({ ...user, key: user.user_id }));
            setUserList(data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    const handleDeleteUser = async (user_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                fetchUserList();
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
            title: 'User ID',
            dataIndex: 'user_id',
            key: 'user_id',
            sorter: {
                compare: (a, b) => (a.user_id - b.user_id),
                multiple: 1
            }
        },
        {
            title: 'Avatar',
            key: 'avatar',
            align: 'center',
            render: (_, record) => (<StringAvatar fname={record.fname} lname={record.lname} />)
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: {
                compare: (a, b) => (a.username.toLowerCase().localeCompare(b.username.toLowerCase())),
                multiple: 2
            }
        },
        {
            title: 'First Name',
            dataIndex: 'fname',
            key: 'fname',
            sorter: {
                compare: (a, b) => (a.fname.toLowerCase().localeCompare(b.fname.toLowerCase())),
                multiple: 3
            }
        },
        {
            title: 'Last Name',
            dataIndex: 'lname',
            key: 'lname',
            sorter: {
                compare: (a, b) => (a.lname.toLowerCase().localeCompare(b.lname.toLowerCase())),
                multiple: 4
            }
        },
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
            sorter: {
                compare: (a, b) => (a.email.toLowerCase().localeCompare(b.email.toLowerCase())),
                multiple: 5
            }
        },
        {
            title: 'Faculty',
            dataIndex: 'faculty',
            key: 'faculty',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.faculty_name}>
                    <Tag color={record.faculty_color}>{record.faculty_short}</Tag>
                </Tooltip>
            ),
            filters: [
                {
                    text: 'ICT (Information and Communication Technology)',
                    value: 'ICT',
                    children: [
                        {
                            text: 'AA',
                            value: 'AA',
                            children: [
                                {text: 'AS', value: 'AS'},
                                {text: 'EI', value: 'EI'}
                            ]
                        }
                    ]
                }
            ],
            filterMode: 'tree',
            onFilter: (value, record) => (record.faculty_short === value),
            filterSearch: (input, record) => (record.title.toLowerCase().includes(input.toLowerCase()))
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.unit_name}>
                    <Tag>{record.unit_short}</Tag>
                </Tooltip>
            ),
            filters: [
                {
                    text: 'ICT (Information and Communication Technology)',
                    value: 'ICT',
                    children: [
                        {
                            text: 'AA',
                            value: 'AA',
                            children: [
                                {text: 'AS', value: 'AS'},
                                {text: 'EI', value: 'EI'}
                            ]
                        }
                    ]
                }
            ],
            filterMode: 'tree',
            onFilter: (value, record) => (record.faculty_short === value),
            filterSearch: (input, record) => (record.title.toLowerCase().includes(input.toLowerCase()))
        },
        {
            title: 'Division',
            dataIndex: 'division',
            key: 'division',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.division_name}>
                    <Tag>{record.division_short}</Tag>
                </Tooltip>
            ),
            filters: [
                {
                    text: 'ICT (Information and Communication Technology)',
                    value: 'ICT',
                    children: [
                        {
                            text: 'AA',
                            value: 'AA',
                            children: [
                                {text: 'AS', value: 'AS'},
                                {text: 'EI', value: 'EI'}
                            ]
                        }
                    ]
                }
            ],
            filterMode: 'tree',
            onFilter: (value, record) => (record.faculty_short === value),
            filterSearch: (input, record) => (record.title.toLowerCase().includes(input.toLowerCase()))
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                {text: 'Admin', value: 'Admin'},
                {text: 'Staff', value: 'Staff'}
            ],
            onFilter: (value, record) => (record.role === value)
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title='View'>
                        <Link href={`/user-management/${record.user_id}`}>
                            <EyeOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title='Edit'>
                        <Link href={`/user-management/${record.user_id}/edit`}>
                            <EditOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title='Delete'>
                        <Popconfirm
                            title='Delete the user'
                            description='Are you sure to delete this user?'
                            onConfirm={() => (handleDeleteUser(record.user_id))}
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
                dataSource={userList}
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