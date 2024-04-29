'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import bcrypt from 'bcryptjs-react';

import { Layout, Row, Space, Form, Input, Button, message, Spin } from 'antd';
import { gold } from '@ant-design/colors';

const { Content } = Layout;

export default function PageContent({ user_id }) {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${user_id}`);
            const data = response.data;
            setUserData(data.data[0]);
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleFinish = async (values) => {
        let body = {};
        
        if (values.password_curr && values.password_new) {
            if (values.password_new.length < 6) {
                message.error('Failed to edit user profile (Password must be at least 6 characters)');
                return;
            }
            if (!bcrypt.compareSync(values.password_curr, userData.password)) {
                message.error('Failed to edit user profile (Invalid current password)')
                return;
            }
            body = { password: bcrypt.hashSync(values.password_new, 10) };
        }
        try {
            body = { ...body, fname: values.fname, lname: values.lname, email: values.email }
            setButtonLoading(true);
            const response = await axios.put(`http://localhost:3000/api/users/${user_id}`, body);
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

    return ( isLoading ? <Spin fullscreen /> :
        <Content style={{ padding: '24px' }}>
            <Row justify='center'>
                <Form 
                    form={form}
                    onFinish={handleFinish}
                    labelCol={{ span: 8 }} 
                    wrapperCol={{ span: 16 }} 
                    initialValues={{ 
                        username: userData.username,
                        fname: userData.fname,
                        lname: userData.lname,
                        email: userData.email
                    }}
                    style={{ width: '600px' }}
                >
                    <Form.Item
                        label='Username'
                        name='username'
                        extra='Your username cannot be changed.'
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label='Current Password'
                        name='password_curr'
                        extra='Please enter your current password to change password.'
                    >
                        <Input.Password placeholder='Enter your current password' />
                    </Form.Item>
                    <Form.Item
                        label='New Password'
                        name='password_new'
                        extra='Password must be at least 6 characters.'
                    >
                        <Input.Password placeholder='Enter your new password' />
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
                            <Link href={`/profile`}>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}