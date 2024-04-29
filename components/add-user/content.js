'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Space, Form, Input, Select, Button, message } from 'antd';

const { Content } = Layout;

export default function PageContent() {
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);

    const [facultyOptions, setFacultyOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [divisionOptions, setDivisionOptions] = useState([]);

    const fetchFacultyOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faculties`);
            const data = response.data;
            setFacultyOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchFacultyOptions();
    }, []);

    const handleFacultyChange = async (value) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/units?faculty_id=${value}`);
            const data = response.data;
            setUnitOptions(data.data);
            setDivisionOptions([]);
            form.resetFields(['unit_id', 'division_id']);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleUnitChange = async (value) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/divisions?unit_id=${value}`);
            const data = response.data;
            setDivisionOptions(data.data);
            form.resetFields(['division_id']);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleFinish = async (values) => {
        if (values.password.length < 6) {
            message.error('Failed to add a new user (Password must be at least 6 characters)');
            return;
        }
        try {
            setButtonLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, values);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
            }
            else {
                message.error(`Failed to add a new user (Detail: ${data.message})`);
            }
        } catch (error) {
            message.error(`Failed to add a new user (Detail: ${error})`);
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
                        label='Username'
                        name='username'
                        rules={[{required: true, message: 'Please enter a username'}]}
                        extra='Username must be unique.'
                    >
                        <Input placeholder='Enter a username' />
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name='password'
                        rules={[{required: true, message: 'Please enter a password'}]}
                        extra='Password must be at least 6 characters.'
                    >
                        <Input.Password placeholder='Enter a password' />
                    </Form.Item>
                    <Form.Item
                        label='First Name'
                        name='fname'
                        rules={[{required: true, message: 'Please enter a first name'}]}
                    >
                        <Input placeholder='Enter a first name' />
                    </Form.Item>
                    <Form.Item
                        label='Last Name'
                        name='lname'
                        rules={[{required: true, message: 'Please enter a last name'}]}
                    >
                        <Input placeholder='Enter a last name' />
                    </Form.Item>
                    <Form.Item
                        label='Email Address'
                        name='email'
                        rules={[{required: true, message: 'Please enter an email address'}]}
                    >
                        <Input placeholder='Enter an email address' />
                    </Form.Item>
                    <Form.Item
                        label='Faculty'
                        name='faculty_id'
                        rules={[{required: true, message: 'Please select a faculty'}]}
                    >
                        <Select
                            placeholder='Select a faculty'
                            onChange={handleFacultyChange}
                            options={facultyOptions.map((item) => (
                                { label: `${item.faculty_short} (${item.faculty_name})`, value: item.faculty_id }
                            ))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Unit'
                        name='unit_id'
                        rules={[{required: true, message: 'Please select a unit'}]}
                    >
                        <Select
                            placeholder='Select a unit'
                            onChange={handleUnitChange}
                            options={unitOptions.map((item) => (
                                { label: `${item.unit_short} (${item.unit_name})`, value: item.unit_id }
                            ))}
                            disabled={unitOptions.length === 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Division'
                        name='division_id'
                        rules={[{required: true, message: 'Please select a division'}]}
                    >
                        <Select
                            placeholder='Select a division'
                            options={divisionOptions.map((item) => (
                                { label: `${item.division_short} (${item.division_name})`, value: item.division_id }
                            ))}
                            disabled={divisionOptions.length === 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Role'
                        name='role'
                        rules={[{required: true, message: 'Please select a role'}]}
                    >
                        <Select
                            placeholder='Select a role'
                            options={[
                                {label: 'Admin', value: 'Admin'},
                                {label: 'Staff', value: 'Staff'}
                            ]}
                            style={{ width: '40%' }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Space>
                            <Button type='primary' htmlType='submit' loading={buttonLoading}>Add</Button>
                            <Link href='/user-management'>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}