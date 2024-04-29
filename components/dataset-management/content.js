'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import _ from 'lodash';
import abbreviate from 'number-abbreviate';

import { Layout, Row, Col, Space, Typography, Table, Tooltip, Tag, Popconfirm, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { filesize } from 'filesize';

import TableHeader from './table-header';
import StringAvatar from '../etc/avatar-string';
import StringTag from '../etc/tag-string';

const { Content } = Layout;
const { Text } = Typography;

export default function PageContent() {
    const [datasetList, setDatasetList] = useState([]);
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    const fetchDatasetList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            const data = response.data;
            const new_data = data.data.map((dataset) => ({ ...dataset, key: dataset.dataset_id, total_size: _.sumBy(dataset.tables, 'table_size') }));
            setDatasetList(new_data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchFacultyOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faculties`);
            const data = response.data;
            setFacultyOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchTagOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
            const data = response.data;
            setTagOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetList();
        fetchFacultyOptions();
        fetchTagOptions();
    }, []);

    const handleDeleteDataset = async (dataset_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${dataset_id}`);
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

    const column_items = [
        {
            title: 'Dataset ID',
            dataIndex: 'dataset_id',
            key: 'dataset_id',
            sorter: {
                compare: (a, b) => (a.dataset_id - b.dataset_id),
                multiple: 1
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: {
                compare: (a, b) => (a.title.toLowerCase().localeCompare(b.title.toLowerCase())),
                multiple: 2
            }
        },
        {
            title: 'Owner',
            key: 'owner',
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
            title: 'Number of Tables',
            dataIndex: 'num_tables',
            key: 'num_tables',
            align: 'center',
            sorter: {
                compare: (a, b) => (a.num_tables - b.num_tables),
                multiple: 4
            }
        },
        {
            title: 'Total Size',
            dataIndex: 'total_size',
            key: 'total_size',
            align: 'center',
            render: (_, record) => (filesize(record.total_size)),
            sorter: {
                compare: (a, b) => (a.total_size - b.total_size),
                multiple: 5
            }
        },
        {
            title: 'Total Views',
            dataIndex: 'view_count',
            key: 'view_count',
            align: 'center',
            render: (_, record) => (`${abbreviate(record.view_count, 1)} views`),
            sorter: {
                compare: (a, b) => (a.view_count - b.view_count),
                multiple: 6
            }
        },
        {
            title: 'Total Exports',
            dataIndex: 'export_count',
            key: 'export_count',
            align: 'center',
            render: (_, record) => (`${abbreviate(record.export_count, 1)} times`),
            sorter: {
                compare: (a, b) => (a.export_count - b.export_count),
                multiple: 7
            }
        },
        {
            title: 'Created Date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (_, record) => (new Date(record.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })),
            sorter: {
                compare: (a, b) => {
                    const date_a = new Date(a.created_date);
                    const date_b = new Date(b.created_date);
                    return date_a - date_b;
                },
                multiple: 8
            }
        },
        {
            title: 'Last Modified',
            dataIndex: 'modified_date',
            key: 'modified_date',
            render: (_, record) => (new Date(record.modified_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })),
            sorter: {
                compare: (a, b) => {
                    const date_a = new Date(a.modified_date);
                    const date_b = new Date(b.modified_date);
                    return date_a - date_b;
                },
                multiple: 9
            }
        },
        {
            title: 'Organization',
            dataIndex: 'faculty',
            key: 'faculty',
            align: 'center',
            render: (_, record) => (
                <Tooltip title={record.faculty_name}>
                    <Tag color={record.faculty_color}>{record.faculty_short}</Tag>
                </Tooltip>
            ),
            filters: facultyOptions.map((faculty) => ({ text: `${faculty.faculty_short} (${faculty.faculty_name})`, value: faculty.faculty_id })),
            onFilter: (value, record) => (record.faculty_id === value),
            filterSearch: (input, record) => (record.text.toLowerCase().includes(input.toLowerCase()))
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (_, record) => (
                <Space direction='vertical'>
                    {record.tags && record.tags.split(',').map((tag) => (<StringTag name={tag} />))}
                </Space>
            ),
            filters: tagOptions.map((tag) => ({ text: tag.tag_name, value: tag.tag_name })).sort((a, b) => (a.text.localeCompare(b.text))),
            onFilter: (value, record) => (record.tags && record.tags.includes(value)),
            filterSearch: (input, record) => (record.text.toLowerCase().includes(input.toLowerCase()))
        },
        {
            title: 'Data Language',
            dataIndex: 'data_lang',
            key: 'data_lang',
            filters: [
                {text: 'English', value: 'English'},
                {text: 'Thai', value: 'Thai'},
                {text: 'Others', value: 'Others'}
            ],
            onFilter: (value, record) => (record.data_lang === value)
        },
        {
            title: 'Permission',
            dataIndex: 'permission_type',
            key: 'permission_type',
            filters: [
                {text: 'Private', value: 'Private'},
                {text: 'Public', value: 'Public'},
                {text: 'Shared with faculty', value: 'Faculty'},
                {text: 'Shared with unit', value: 'Unit'},
                {text: 'Shared with division', value: 'Division'}
            ],
            onFilter: (value, record) => (record.permission_type === value)
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Tooltip title='Delete'>
                    <Popconfirm
                        title='Delete the dataset'
                        description='Are you sure to delete this dataset?'
                        onConfirm={() => (handleDeleteDataset(record.dataset_id))}
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
                dataSource={datasetList}
                title={() => (<TableHeader setDatasetList={setDatasetList} />)}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => (`Total ${total} items`)
                }}
                expandable={{
                    expandedRowRender: (record) => (
                        <Row gutter={24}>
                            <Col span={8}>
                                <Space direction='vertical'>
                                    <Text strong>Subtitle:</Text>
                                    <Text>{record.subtitle}</Text>
                                </Space>
                            </Col>
                            <Col>
                                <Divider type='vertical' style={{ height: '100%' }} />
                            </Col>
                            <Col>
                                <Space direction='vertical'>
                                    <Text strong>Description:</Text>
                                    <Text>{record.description ? record.description : '-'}</Text>
                                </Space>
                            </Col>
                        </Row>
                    )
                }}
                scroll={{ x: 'max-content' }}
            />
        </Content>
    );
}