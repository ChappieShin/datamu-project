'use client'

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

import { Layout, Row, Space, Typography, Form, Input, Select, Button, message } from 'antd';

const { Content } = Layout;
const { Paragraph } = Typography;

export default function PageContent({ dataset, user_id }) {
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [apiLink, setApiLink] = useState('');

    const fetchLogExport = async (export_format, status) => {
        try {
            const body = { dataset_id: dataset.dataset_id, user_id: user_id, detail: export_format, status: status }
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EXPORT`, body);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleFinish = async (values) => {
        if (values.export_format === 'api') {
            setApiLink(`${process.env.NEXT_PUBLIC_API_URL}/api/export?user_id=${user_id}&dataset_id=${dataset.dataset_id}&table_ids=${values.tables}&api_key=<Your API Key>`);
            return;
        }
        try {
            setButtonLoading(true);
            if (values.export_format === 'xlsx') {
                const workbook = XLSX.utils.book_new();
                const promises = values.tables.map(async (table_id) => {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/${table_id}`);
                    const data = response.data;
                    const worksheet = XLSX.utils.json_to_sheet(data.data.data);
                    XLSX.utils.book_append_sheet(workbook, worksheet, data.data.table_name);
                });
                await Promise.all(promises);
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${values.title}.xlsx`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
                fetchLogExport(values.export_format, 'Success');
            }
            else if (values.export_format === 'csv') {
                const zip = new JSZip();
                const promises = values.tables.map(async (table_id) => {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/${table_id}`);
                    const data = response.data;
                    const worksheet = XLSX.utils.json_to_sheet(data.data.data);
                    const csv_data = XLSX.utils.sheet_to_csv(worksheet);
                    zip.file(`${data.data.table_name}.csv`, csv_data, { binary: true });
                });
                await Promise.all(promises);
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${values.title}.zip`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
                fetchLogExport(values.export_format, 'Success');
            }
        } catch (error) {
            console.log('Error', error);
            message.error(error.message);
            fetchLogExport(values.export_format, 'Failed');
        } finally {
            setButtonLoading(false);
        }
    };

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <Content style={{ padding: '24px' }}>
            <Row justify='center'>
                <Form
                    form={form}
                    onFinish={handleFinish}
                    labelCol={{ span: 8 }} 
                    wrapperCol={{ span: 16 }} 
                    style={{ width: '600px' }}
                >
                    <Form.Item
                        label='Dataset'
                        name='title'
                        initialValue={dataset.title}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label='Table'
                        name='tables'
                        rules={[{required: true, message: 'Please select a table(s)'}]}
                    >
                        <Select
                            mode='multiple'
                            allowClear
                            showSearch
                            filterOption={(input, option) => (option.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            placeholder='Select a table(s)'
                            options={dataset.tables.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Export Format'
                        name='export_format'
                        rules={[{required: true, message: 'Please select an export format'}]}
                    >
                        <Select
                            placeholder='Select an export format'
                            options={[
                                {label: 'CSV (.csv)', value: 'csv'},
                                {label: 'Excel (.xlsx)', value: 'xlsx'},
                                {label: 'API', value: 'api'}
                            ]}
                            style={{ width: '50%' }}
                        />
                    </Form.Item>
                    { apiLink &&
                        <Form.Item label='API Link'>
                            <Paragraph code copyable>{apiLink}</Paragraph>
                        </Form.Item>
                    }
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Space>
                            <Button type='primary' htmlType='submit' loading={buttonLoading}>Export</Button>
                            <Link href={`/explore-dataset/${dataset.dataset_id}`}>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}