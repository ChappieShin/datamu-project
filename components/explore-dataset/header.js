'use client'
import { Layout, Row, Col, Space, Typography, Breadcrumb, Input, Select } from 'antd';

const { Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export default function PageHeader({ datasetList, searchKeyword, handleSearch, permissionOption, setPermissionOption, sortOption, setSortOption }) {

    return (
        <Header style={{ height: 'auto', padding: '24px', background: 'white' }}>
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Breadcrumb items={[{title: 'Dataset'}, {title: 'Explore Dataset'}]} />
                <Title level={2} style={{ margin: 0 }}>Explore Dataset</Title>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '26px' }}>
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
                                                        value={permissionOption}
                                                        options={[
                                                            {label: 'All', value: 'all'},
                                                            {label: 'Owned by me', value: 'owned'},
                                                            {label: 'Shared with me', value: 'shared'}
                                                        ]}
                                                        onChange={(value) => (setPermissionOption(value))}
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