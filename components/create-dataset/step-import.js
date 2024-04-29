import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Row, Space, Typography, Form, Table, Input, Button, Tooltip, Upload, Select, message } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined, FileExcelOutlined } from '@ant-design/icons';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

export default function ImportData({ datasetForm, handleForm, nextStep, prevStep }) {
    const { data: session, status } = useSession();
    const [form] = Form.useForm();
    const [dataItems, setDataItems] = useState([{ key: 0 }]);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleFinish = async (values) => {
        const table_list = await formatData(values);
        const dataset_data = { ...datasetForm, owner_id: session.user.name, tables: table_list }
        try {
            setButtonLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`, dataset_data);
            const data = response.data;
            if (!data.error) {
                handleForm({ ...datasetForm, dataset_id: data.data.insertId });
                message.success(data.message);
                nextStep();
            }
            else {
                message.error(`Failed to create a new dataset (Detail: ${data.message})`);
            }
        } catch (error) {
            message.error(`Failed to create a new dataset (Detail: ${error})`);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleAddRow = () => {
        setDataItems([...dataItems, { key: dataItems[dataItems.length - 1].key + 1 }]);
    };

    const handleDeleteRow = (recordKey) => {
        if (dataItems.length === 1) {
            message.error('Unable to delete (Your dataset must have at least one data table)');
        }
        else {
            setDataItems(dataItems.filter((item) => (item.key !== recordKey)));
        }
    };

    const parseCSVFile = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file.originFileObj, {
                complete: function(results) {
                    resolve(results.data);
                },
                error: function(error) {
                    reject(error);
                },
                header: true
            });
        });
    };

    const parseExcelFile = (file, sheet_name) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[sheet_name];
                const sheet_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const headers = sheet_data.shift();
                const json_data = sheet_data.map((row) => {
                    const record = {};
                    headers.forEach((header, index) => {
                        record[header] = row[index];
                    });
                    return record;
                });
                resolve(json_data);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file.originFileObj);
        });
    };

    const handleUploadFile = (file, recordKey) => {
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet_names = workbook.SheetNames;
                setDataItems((prev) => (prev.map((item) => {
                    if (item.key === recordKey) {
                        return { ...item, sheet_list: sheet_names }
                    }
                    return item;
                })));
            };
            reader.readAsArrayBuffer(file); 
        }
        else if (file.type === 'text/csv') {
            setDataItems((prev) => (prev.map((item) => {
                if (item.key === recordKey) {
                    return { ...item, sheet_list: null }
                }
                return item;
            })));
        }
        form.resetFields([['sheet_name', recordKey]]);
    };

    const formatData = async (data) => {
        const tables = [];
        for (let i = 0; i < data.table_name.length; i++) {
            const table_name = data.table_name[i];
            const description = data.description[i];
            const data_file = data.data_file[i];
            const sheet_name = data.sheet_name[i];

            if (table_name !== undefined && data_file !== undefined && sheet_name === undefined) {
                tables.push({
                    table_name: table_name,
                    description: description,
                    file_name: data_file.file.name,
                    file_format: 'csv',
                    data: await parseCSVFile(data_file.file)
                });
            }
            else if (table_name !== undefined && data_file !== undefined && sheet_name !== undefined) {
                tables.push({
                    table_name: table_name,
                    description: description,
                    file_name: data_file.file.name,
                    file_format: 'xlsx',
                    data: await parseExcelFile(data_file.file, sheet_name)
                });
            }
        }
        return tables;
    }

    const columnItems = [
        {
            title: '#',
            key: 'number',
            align: 'center',
            render: (_, record, index) => (index + 1)
        },
        {
            title: 'Table Name',
            key: 'table_name',
            render: (_, record) => (
                <Form.Item
                    name={['table_name', record.key]}
                    rules={[{required: true, message: 'Please enter a table name'}]}
                    style={{ marginBottom: 0 }}
                >
                    <Input placeholder='Enter a table name' showCount maxLength={50} />
                </Form.Item>
            )
        },
        {
            title: <Text>Description <Text type='secondary' style={{ fontWeight: 'normal' }}>(optional)</Text></Text>,
            key: 'description',
            render: (_, record) => (
                <Form.Item
                    name={['description', record.key]}
                    style={{ marginBottom: 0 }}
                >
                    <Input placeholder='Enter a description' showCount maxLength={100} />
                </Form.Item>
            )
        },
        {
            title: 'Import Data',
            key: 'data_file',
            render: (_, record) => (
                <Form.Item
                    name={['data_file', record.key]}
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value || value.fileList.length === 0) {
                                    return Promise.reject('Please select a file');
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                    style={{ marginBottom: 0 }}
                >
                    <Upload 
                        accept='.csv, .xlsx'
                        maxCount={1}
                        itemRender={(originNode, file) => {
                            const file_name = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name;
                            const icon = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? <FileExcelOutlined /> : <FileTextOutlined />;
                            const node = React.cloneElement(originNode, {}, [
                                React.cloneElement(originNode.props.children[0], {}, icon),
                                [
                                    React.cloneElement(originNode.props.children[1][0], {}, file_name),
                                    originNode.props.children[1][1]
                                ],
                                originNode.props.children[2],
                                originNode.props.children[3]
                            ]);
                            return node;
                        }}
                        beforeUpload={(file) => (handleUploadFile(file, record.key))}
                    >
                        <Button type='primary' icon={<UploadOutlined />}>
                            Upload (.csv or .xlsx file)
                        </Button>
                    </Upload>
                </Form.Item>
            )
        },
        {
            title: 'Sheet Name',
            key: 'sheet_name',
            render: (_, record) => (
                <Form.Item
                    name={['sheet_name', record.key]}
                    rules={[{required: record.sheet_list, message: 'Please select a sheet'}]}
                    style={{ marginBottom: 0 }}
                >
                    <Select
                        placeholder='Select a sheet'
                        options={record.sheet_list && record.sheet_list.map((sheet_name, index) => (
                            { label: sheet_name, value: sheet_name, key: index }
                        ))}
                        disabled={!record.sheet_list}
                        style={{ width: '160px' }}
                    />
                </Form.Item>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: 10,
            render: (_, record) => (
                <Tooltip title='Delete'>
                    <Link href='#'>
                        <DeleteOutlined onClick={() => handleDeleteRow(record.key)} />
                    </Link>
                </Tooltip>
            )
        }
    ];

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <Form form={form} onFinish={handleFinish}>
            <Space direction='vertical' size='middle'>
                <Table
                    columns={columnItems}
                    dataSource={dataItems}
                    title={() => (<Title level={3} style={{ margin: 0 }}>Data Table</Title>)}
                    pagination={false}
                    style={{ width: '1100px' }}
                />
                <Button 
                    type='dashed'
                    icon={<PlusOutlined />}
                    onClick={handleAddRow}
                    block
                >
                    Add new data table
                </Button>
                <Row justify='end'>
                    <Space>
                        <Button type='primary' htmlType='submit' loading={buttonLoading}>Create</Button>
                        <Button onClick={() => (prevStep())}>Back</Button>
                    </Space>
                </Row>
            </Space>
        </Form>
    );
}