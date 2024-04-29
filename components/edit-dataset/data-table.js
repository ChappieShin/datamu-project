import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Row, Space, Typography, Form, Table, Input, Button, Tooltip, Upload, Select, Popconfirm, Modal, message } from 'antd';
import { UploadOutlined, SaveOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined, FileExcelOutlined } from '@ant-design/icons';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

export default function DataTable({ dataset, fetchDatasetData }) {
    const [form] = Form.useForm();
    const [formAddTable] = Form.useForm();

    const [datasetTables, setDatasetTables] = useState(dataset.tables);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalAddTable, setModalAddTable] = useState(false);
    const [sheetList, setSheetList] = useState([]);

    const handleAddTableFinish = async (values) => {
        const data_format = values.data_file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? 'xlsx' : 'csv';
        const table = {
            table_name: values.table_name,
            description: values.description,
            file_name: values.data_file.file.name,
            file_size: values.data_file.file.size,
            file_format: data_format,
            table_type: 'original',
            dataset_id: dataset.dataset_id,
            data: data_format === 'csv' ? await parseCSVFile(values.data_file.file) : await parseExcelFile(values.data_file.file, values.sheet_name)
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tables`, table);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                formAddTable.resetFields();
                fetchDatasetData();
                setModalAddTable(false);
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleAddTableCancel = () => {
        formAddTable.resetFields();
        setSheetList([]);
        setModalAddTable(false);
    };

    const handleEditDataTable = async (table_id) => {
        const data_file = form.getFieldValue(['data_file', table_id]);
        const sheet_name = form.getFieldValue(['sheet_name', table_id]);

        let data_format;
        if (data_file) {
            if (data_file.file.status === 'removed') {
                message.error('Please select a file');
                return;
            }
            data_format = data_file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? 'xlsx' : 'csv';
        }

        if (data_format === 'xlsx' && !sheet_name) {
            message.error('Please select a sheet');
            return;
        }

        const table = !data_file ? 
        {
            table_name: form.getFieldValue(['table_name', table_id]),
            description: form.getFieldValue(['description', table_id])
        } :
        {
            table_name: form.getFieldValue(['table_name', table_id]),
            description: form.getFieldValue(['description', table_id]),
            file_name: data_file.file.name,
            file_size: data_file.file.size,
            file_format: data_format,
            table_type: 'original',
            data: data_format === 'csv' ? await parseCSVFile(data_file.file) : await parseExcelFile(data_file.file, sheet_name)
        };
        
        try {
            setButtonLoading(true);
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/${table_id}`, table);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                fetchDatasetData();
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleDeleteDataTable = async (table_id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/${table_id}`);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                fetchDatasetData();
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
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

    const handleUploadFile = (file, key) => {
        if (key) {
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet_names = workbook.SheetNames;
                    setDatasetTables((prev) => (prev.map((item) => {
                        if (item.table_id === key) {
                            return { ...item, sheet_list: sheet_names }
                        }
                        return item;
                    })));
                };
                reader.readAsArrayBuffer(file); 
            }
            else if (file.type === 'text/csv') {
                setDatasetTables((prev) => (prev.map((item) => {
                    if (item.table_id === key) {
                        return { ...item, sheet_list: null }
                    }
                    return item;
                })));
            }
            form.resetFields([['sheet_name', key]]);
        }
        else {
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet_names = workbook.SheetNames;
                    setSheetList(sheet_names);
                };
                reader.readAsArrayBuffer(file); 
            }
            setSheetList([]);
            formAddTable.resetFields(['sheet_name']);
        }
    };

    const column_items = [
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
                    name={['table_name', record.table_id]}
                    rules={[{required: true, message: 'Please enter a table name'}]}
                    initialValue={record.table_name}
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
                    name={['description', record.table_id]}
                    initialValue={record.description}
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
                    name={['data_file', record.table_id]}
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
                        defaultFileList={[{
                            uid: record.table_id,
                            name: record.file_name,
                            type: record.file_format
                        }]}
                        itemRender={(originNode, file) => {
                            console.log(file)
                            if (file.name && file.type) {
                                const file_name = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name;
                                const icon = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || record.file_type === 'xlsx') ? <FileExcelOutlined /> : <FileTextOutlined />;
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
                            }
                            else {
                                return originNode;
                            }
                        }}
                        beforeUpload={(file) => (handleUploadFile(file, record.table_id))}
                    >
                        <Button type='primary' icon={<UploadOutlined />} disabled={record.table_type === 'Processed'}>
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
                    name={['sheet_name', record.table_id]}
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
                <Space>
                    <Tooltip title='Save'>
                        <Link href='#'>
                            <SaveOutlined onClick={() => handleEditDataTable(record.table_id)} spin={buttonLoading} />
                        </Link>
                    </Tooltip>
                    <Tooltip title='Delete'>
                        <Popconfirm
                            title='Delete the data table'
                            description='Are you sure to delete this data table?'
                            onConfirm={() => (handleDeleteDataTable(record.table_id))}
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
        <>
            <Form form={form}>
                <Space direction='vertical' size='middle'>
                    <Table
                        columns={column_items}
                        dataSource={dataset.tables}
                        title={() => (<Title level={3} style={{ margin: 0 }}>Data Table</Title>)}
                        pagination={false}
                        style={{ width: '1100px' }}
                    />
                    <Button 
                        type='dashed'
                        icon={<PlusOutlined />}
                        onClick={() => (setModalAddTable(true))}
                        style={{ width: '100%' }}
                    >
                        Add new data table
                    </Button>
                    <Row justify='end'>
                        <Link href={`/my-dataset/${dataset.dataset_id}`}>
                            <Button type='primary' danger>Cancel</Button>
                        </Link>
                    </Row>
                </Space>
            </Form>
            <Modal
                title='Add New Data Table'
                open={modalAddTable}
                onCancel={handleAddTableCancel}
                footer={[]}
            >
                <Form form={formAddTable} onFinish={handleAddTableFinish} style={{ paddingTop: '15px' }}>
                    <Form.Item
                        label='Table Name'
                        name='table_name'
                        rules={[{required: true, message: 'Please enter a table name'}]}
                    >
                        <Input placeholder='Enter a table name' showCount maxLength={50} />
                    </Form.Item>
                    <Form.Item
                        label={<Text>Description <Text type='secondary' style={{ fontWeight: 'normal' }}>(optional)</Text></Text>}
                        name='description'
                    >
                        <Input.TextArea placeholder='Enter a table description' rows={3} showCount maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        label='Upload File'
                        name='data_file'
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    if (!value || value.fileList.length === 0) {
                                        return Promise.reject('Please select a file');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Upload 
                            accept='.csv, .xlsx'
                            maxCount={1}
                            itemRender={(originNode, file) => {
                                const file_name = file.name.length > 40 ? `${file.name.slice(0, 40)}...` : file.name;
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
                            beforeUpload={(file) => (handleUploadFile(file, null))}
                        >
                            <Button type='primary' icon={<UploadOutlined />}>
                                Upload (.csv or .xlsx file)
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label='Sheet Name'
                        name='sheet_name'
                        rules={[{required: sheetList.length>0, message: 'Please select a sheet'}]}
                    >
                        <Select
                            placeholder='Select a sheet'
                            options={sheetList.map((sheet_name, index) => (
                                { label: sheet_name, value: sheet_name, key: index }
                            ))}
                            disabled={sheetList.length===0}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleAddTableCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Add</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}