'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Space, Form, Input, Select, Button, message } from 'antd';
import { gold } from '@ant-design/colors';

const { Content } = Layout;

export default function PageContent({ user }) {
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);

    const [facultyOptions, setFacultyOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [divisionOptions, setDivisionOptions] = useState([]);

    const fetchFacultyOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/faculties');
            const data = response.data;
            setFacultyOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchUnitOptions = async (faculty_id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/units?faculty_id=${faculty_id}`);
            const data = response.data;
            setUnitOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchDivisionOptions = async (unit_id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/divisions?unit_id=${unit_id}`);
            const data = response.data;
            setDivisionOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchFacultyOptions();
        fetchUnitOptions(form.getFieldValue('faculty_id'));
        fetchDivisionOptions(form.getFieldValue('unit_id'));
    }, []);

    const handleFacultyChange = async (value) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/units?faculty_id=${value}`);
            const data = response.data;
            setUnitOptions(data.data);
            setDivisionOptions([]);
            form.setFieldsValue({ unit_id: undefined, division_id: undefined });
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleUnitChange = async (value) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/divisions?unit_id=${value}`);
            const data = response.data;
            setDivisionOptions(data.data);
            form.setFieldsValue({ division_id: undefined });
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handleFinish = async (values) => {
        try {
            setButtonLoading(true);
            const response = await axios.put(`http://localhost:3000/api/users/${user.user_id}`, values);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            message.error(data.message);
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <Content style={{ padding: '24px' }}>
            <Row justify='center'>
                <Form 
                    form={form} 
                    onFinish={handleFinish}
                    labelCol={{ span: 8 }} 
                    wrapperCol={{ span: 16 }} 
                    initialValues={{ 
                        username: user.username,
                        fname: user.fname,
                        lname: user.lname,
                        email: user.email,
                        faculty_id: user.faculty_id,
                        unit_id: user.unit_id,
                        division_id: user.division_id,
                        role: user.role
                    }}
                    style={{ width: '600px' }}
                >
                    <Form.Item
                        label='Username'
                        name='username'
                        rules={[{required: true, message: 'Please enter a username'}]}
                    >
                        <Input placeholder='Enter a username' />
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
                                {label: 'Admin', value: 'admin'},
                                {label: 'Staff', value: 'staff'}
                            ]}
                            style={{ width: '40%' }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Space>
                            <Button 
                                type='primary' 
                                htmlType='submit' 
                                loading={buttonLoading} 
                                style={{ backgroundColor: gold.primary }}
                            >
                                Save
                            </Button>
                            <Link href={`/user-management/${user.user_id}`}>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}