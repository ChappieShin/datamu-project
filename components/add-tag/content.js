'use client'

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Space, Form, Input, Button, message } from 'antd';

const { Content } = Layout;

export default function PageContent() {
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleFinish = async (values) => {
        try {
            setButtonLoading(true);
            const response = await axios.post('http://localhost:3000/api/tags', values);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
            }
            else {
                message.error(`Failed to add a new tag (Detail: ${data.message})`);
            }
        } catch (error) {
            message.error(`Failed to add a new tag (Detail: ${error})`);
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
                    style={{ width: '600px' }}
                >
                    <Form.Item
                        label='Tag Name'
                        name='tag_name'
                        rules={[{required: true, message: 'Please enter a tag name'}]}
                    >
                        <Input placeholder='Enter a tag name' />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Space>
                            <Button type='primary' htmlType='submit' loading={buttonLoading}>Add</Button>
                            <Link href='/tag-management'>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}