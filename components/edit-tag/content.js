'use client'

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Layout, Row, Space, Form, Input, Button, message } from 'antd';
import { gold } from '@ant-design/colors';

const { Content } = Layout;

export default function PageContent({ tag }) {
    const [form] = Form.useForm();
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleFinish = async (values) => {
        try {
            setButtonLoading(true);
            const response = await axios.put(`http://localhost:3000/api/tags/${tag.tag_id}`, values);
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
                        tag_name: tag.tag_name
                    }}
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
                            <Button 
                                type='primary' 
                                htmlType='submit' 
                                loading={buttonLoading} 
                                style={{ backgroundColor: gold.primary }}
                            >
                                Save
                            </Button>
                            <Link href={`/tag-management`}>
                                <Button type='primary' danger>Cancel</Button>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
        </Content>
    );
}