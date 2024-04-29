import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Space, Typography, Form, Input, Select, Radio, Button, Cascader, Tag, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function EnterForm({ handleForm, nextStep }) {
    const [form] = Form.useForm();

    const [tagOptions, setTagOptions] = useState([]);
    const [tagCount, setTagCount] = useState(0);

    const fetchTagOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
            const data = response.data;
            setTagOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchTagOptions();
    }, []);

    const handleFinish = (values) => {
        handleForm(values);
        nextStep();
    };

    const string2color = (string) => {
        let hash = 0;
        let color = '#';
        let i;
    
        for (i = 0 ; i < string.length ; i+=1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        for (i = 0 ; i < 3 ; i+=1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
    
        return color;
    }

    return (
        <Form 
            form={form} 
            onFinish={handleFinish}
            labelCol={{ span: 8 }} 
            wrapperCol={{ span: 16 }} 
            style={{ width: '600px' }}
        >
            <Form.Item
                label='Title'
                name='title'
                rules={[{required: true, message: 'Please enter a title'}]}
            >
                <Input placeholder='Enter a title of your dataset' showCount maxLength={50} />
            </Form.Item>
            <Form.Item
                label='Subtitle'
                name='subtitle'
                rules={[{required: true, message: 'Please enter a subtitle'}]}
            >
                <Input placeholder='Enter a subtitle of your dataset' showCount maxLength={100} />
            </Form.Item>
            <Form.Item
                label={<Text>Description <Text type='secondary'>(optional)</Text></Text>}
                name='description'
            >
                <Input.TextArea placeholder='Enter a description of your dataset' rows={4} showCount maxLength={2000} />
            </Form.Item>
            <Form.Item
                label={<Text>Tag <Text type='secondary'>(optional)</Text></Text>}
                name='tag_ids'
            >
                <Select
                    mode='multiple'
                    allowClear
                    showSearch
                    filterOption={(input, option) => (option.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    placeholder='Select a tag(s)'
                    options={tagOptions.map((tag) => ({ label: tag.tag_name, value: tag.tag_id }))}
                    maxCount={3}
                    tagRender={({ label, value, closable, onClose }) => (
                        <Tag
                            color={string2color(label)}
                            closable={closable}
                            onClose={onClose}
                            style={{ marginRight: 3 }}
                            key={value}
                        >
                            {label}
                        </Tag>
                    )}
                    suffixIcon={
                        <>
                            <span>
                                {tagCount} / 3
                            </span>
                            <DownOutlined />
                        </>
                    }
                    onChange={(value) => (setTagCount(value.length))}
                />
            </Form.Item>
            <Form.Item
                label='Data Language'
                name='data_lang'
                rules={[{required: true, message: 'Please select a data language'}]}
            >
                <Select
                    placeholder='Select a data language'
                    options={[
                        {label: 'English', value: 'English'},
                        {label: 'Thai', value: 'Thai'},
                        {label: 'Others', value: 'Others'}
                    ]}
                    style={{ width: '50%' }}
                />
            </Form.Item>
            <Form.Item
                label='Permission'
                name='permission_type'
                tooltip={
                    <>
                        Your dataset will be shared as follows:<br />
                        Private - Only you can view and edit the dataset.<br />
                        Public - Everyone can only view the dataset.<br />
                        Shared with faculty - Only people in your faculty can view the dataset.<br />
                        Shared with unit - Only people in your unit under your faculty can view the dataset.<br />
                        Shared with division - Only people in your division under your unit and faculty can view the dataset.
                    </>
                }
                rules={[{required: true, message: 'Please select your preferred permission'}]}
                initialValue='Private'
            >
                <Radio.Group>
                    <Space direction='vertical'>
                        <Radio value='Private'>Private</Radio>
                        <Radio value='Public'>Public</Radio>
                        <Radio value='Faculty'>Shared with faculty</Radio>
                        <Radio value='Unit'>Shared with unit</Radio>
                        <Radio value='Division'>Shared with division</Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Space>
                    <Button type='primary' htmlType='submit'>Next</Button>
                    <Link href='/my-dataset'>
                        <Button type='primary' danger>Cancel</Button>
                    </Link>
                </Space>
            </Form.Item>
        </Form>
    );
}