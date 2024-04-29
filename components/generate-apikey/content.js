'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Space, Form, Input, Select, Button, Radio, DatePicker, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import StringAvatar from '../etc/avatar-string';

const { Content } = Layout;

export default function PageContent({ user_id }) {
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [apiKey, setApiKey] = useState(uuidv4());
    const [userOptions, setUserOptions] = useState([]);
    const [customDateValue, setCustomDateValue] = useState(true);
    const [dateValue, setDateValue] = useState(null);

    const fetchUserOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
            const data = response.data;
            setUserOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchUserOptions();
    }, []);

    const handleGenerateApiKey = () => {
        const api_key = uuidv4();
        setApiKey(api_key);
        form.setFieldValue('api_key', api_key);
    };

    const handleDateOptionChange = (e) => {
        setCustomDateValue(e.target.value !== 'custom');
    };

    const handleFinish = async (values) => {
        const body = { ...values, assigned_by: user_id };

        if (values.expired_date === 'custom') {
            body.expired_date = dateValue.format('YYYY-MM-DD HH:mm:ss');
        }
        else {
            body.expired_date = dayjs().add(values.expired_date, 'day').format('YYYY-MM-DD HH:mm:ss');
        }

        try {
            setButtonLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/apikeys`, body);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
            }
            else {
                message.error(`Failed to generate an API key (Detail: ${data.message})`);
            }
        } catch (error) {
            message.error(`Failed to generate an API key (Detail: ${error})`);
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
                        label='API Key'
                        name='api_key'
                        initialValue={apiKey}
                    >
                        <Space.Compact style={{ width: '100%' }}>
                            <Input disabled value={apiKey} />
                            <Button icon={<ReloadOutlined />} onClick={handleGenerateApiKey} />
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item
                        label='User'
                        name='assigned_to'
                        rules={[{required: true, message: 'Please select a user'}]}
                    >
                        <Select
                            placeholder='Select a user'
                            showSearch
                            filterOption={(input, option) => (option.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={[
                                { 
                                    label: 'Admin', 
                                    title: 'admin', 
                                    options: userOptions.filter((item) => (item.role === 'Admin')).map((user) => (
                                        {
                                            label: `${user.fname} ${user.lname}`,
                                            value: user.user_id
                                        }
                                    )).sort((a, b) => a.label.localeCompare(b.label))
                                },
                                { 
                                    label: 'Staff',
                                    title: 'staff',
                                    options: userOptions.filter((item) => (item.role === 'Staff')).map((user) => (
                                        {
                                            label: `${user.fname} ${user.lname}`,
                                            value: user.user_id
                                        }
                                    )).sort((a, b) => a.label.localeCompare(b.label))
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Expired In'
                        name='expired_date'
                        rules={[{required: true, message: 'Please select an expired date'}]}
                        tooltip='You cannot create a new API key for the same user if it has not expired.'
                        initialValue={15}
                    >
                        <Radio.Group onChange={handleDateOptionChange}>
                            <Space direction='vertical'>
                                <Radio value={15}>15 days</Radio>
                                <Radio value={30}>30 days</Radio>
                                <Radio value={60}>60 days</Radio>
                                <Radio value={90}>90 days</Radio>
                                <Radio value='custom'>
                                    <Space>
                                        Custom
                                        <DatePicker 
                                            disabled={customDateValue}
                                            onChange={(date) => (setDateValue(date))}
                                            minDate={dayjs().add(1, 'day')}
                                        />
                                    </Space>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Space>
                            <Button type='primary' htmlType='submit' loading={buttonLoading}>Generate</Button>
                            <Link href='/apikey-management'>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}