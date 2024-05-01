'use client'

import Link from 'next/link';

import { Layout, Row, Col, Space, Typography, Breadcrumb, Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export default function PageHeader({ datasetList, searchKeyword, handleSearch, sortOption, setSortOption }) {

    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb items={[{title: 'Dataset'}, {title: 'My Dataset'}]} />
                <Row justify='space-between'>
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>My Dataset</Title>
                    </Col>
                    <Col>
                        <Link href='/my-dataset/create'>
                            <Button type='primary' icon={<PlusOutlined />}>Create Dataset</Button>
                        </Link>
                    </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
                        <Row>
                            <Search
                                placeholder='Search datasets...'
                                allowClear
                                enterButton
                                defaultValue={searchKeyword}
                                onSearch={(value) => (handleSearch(value))}
                                style={{ width: '700px' }}
                            />
                        </Row>
                        <Row justify='space-between'>
                            <Col>
                                <Row gutter={10}>
                                    <Col>
                                        <Row gutter={5}>
                                            <Col>
                                                <Row>
                                                    <Text>Permission:</Text>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Select
                                                        defaultValue='owned'
                                                        options={[
                                                            {label: 'Owned by me', value: 'owned'}
                                                        ]}
                                                        size='small'
                                                        style={{ width: 140 }}
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row gutter={5}>
                                            <Col>
                                                <Row>
                                                    <Text>Sort by:</Text>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Select
                                                        value={sortOption}
                                                        options={[
                                                            {label: 'None', value: 'none'},
                                                            {label: 'Name ascending', value: 'name_asc'},
                                                            {label: 'Name descending', value: 'name_desc'},
                                                            {label: 'Last modified ascending', value: 'modified_asc'},
                                                            {label: 'Last modified descending', value: 'modified_desc'},
                                                            {label: 'Most viewed', value: 'most_viewed'},
                                                            {label: 'Most exported', value: 'most_exported'}
                                                        ]}
                                                        onChange={(value) => (setSortOption(value))}
                                                        size='small'
                                                        style={{ width: 200 }}
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Text>{`Found ${datasetList.length} dataset(s)`}</Text>
                                </Row>
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Space>
        </Header>
    );
}