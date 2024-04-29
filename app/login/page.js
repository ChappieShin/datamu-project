'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Layout, Row, Space, Typography, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Login() {
    const { data: session, status } = useSession();
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/');
        }
    }, [router, status]);

    const handleFinish = async (values) => {
        try {
            setButtonLoading(true);
            const result = await signIn('credentials', {
                redirect: false,
                username: values.username,
                password: values.password
            });

            if (result.error) {
                message.error(`Failed to log in (${result.error})`);
                return;
            }

            router.push('/');
            
        } catch (error) {
            message.error(`Failed to log in (${error})`);
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Space direction='vertical' size='middle'>
                <Row justify='center'>
                    <Image src='/logo.png' alt='logo' width={64} height={64} />
                    <Title
                        style={{
                            margin: '8px',
                            background: 'linear-gradient(to bottom, #2890E7, #4036CF)',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        Data.mu
                    </Title>
                </Row>
                <Paragraph type='secondary'>Data.mu: Web-Based Data Platform for Mahidol University</Paragraph>
                <Form form={form} onFinish={handleFinish}>
                    <Form.Item
                        name='username'
                        rules={[{required: true, message: 'Please enter a username'}]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#1890FF' }} />} placeholder='Username' />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[{required: true, message: 'Please enter a password'}]}
                    >
                        <Input.Password prefix={<LockOutlined style={{ color: '#1890FF' }} />} placeholder='Password' />
                    </Form.Item>
                    <Form.Item>
                        <Button block type='primary' htmlType='submit' loading={buttonLoading}>Log In</Button>
                    </Form.Item>
                </Form>
                <Row justify='center'>
                    <Text type='secondary'>Data.mu</Text>
                </Row>
                <Row justify='center'>
                    <Text type='secondary'>Copyright ©2024 Faculty of ICT, Mahidol University</Text>
                </Row>
            </Space>
        </Content>
    );
}