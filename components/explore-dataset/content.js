'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Space, Typography, Card, Pagination, Empty, Checkbox, Skeleton } from 'antd';
import { BankOutlined, TagOutlined, TranslationOutlined } from '@ant-design/icons';
import DatasetCard from './card-dataset';

const { Content } = Layout;
const { Link } = Typography;

export default function PageContent({ datasetList, isLoading, organizations, setOrganizations, tags, setTags, dataLanguages, setDataLanguages }) {
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [isFilterLoading, setIsFilterLoading] = useState(true);

    const fetchFacultyOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faculties`);
            const data = response.data;
            setFacultyOptions(data.data.sort((a, b) => (a.faculty_short.localeCompare(b.faculty_short))));
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchTagOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
            const data = response.data;
            setTagOptions(data.data.sort((a, b) => (a.tag_name.localeCompare(b.tag_name))));
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        Promise.all([fetchFacultyOptions(), fetchTagOptions()])
        .then(() => {
            setIsFilterLoading(false);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
        });
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const start_index = (currentPage - 1) * pageSize;
    const end_index = start_index + pageSize;
    const currentData = datasetList.slice(start_index, end_index);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSizeChange = (current, size) => {
        setPageSize(size);
    };

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }
    
    return (
        <Content style={{ padding: '24px' }}>
            <Row gutter={8}>
                <Col span={6}>
                    <Space direction='vertical' style={{ display: 'flex' }}>
                        <Card 
                            title={<Space><BankOutlined />Organizations</Space>}
                            actions={[
                                <Link href='#' onClick={(e) => {
                                    e.preventDefault();
                                    setOrganizations(facultyOptions.map((faculty) => (faculty.faculty_id)));
                                }}>
                                    Select all
                                </Link>,
                                <Link href='#' onClick={(e) => {
                                    e.preventDefault();
                                    setOrganizations([]);
                                }}>
                                    Clear all
                                </Link>,
                            ]}
                        > { isFilterLoading ? <Skeleton active paragraph={{ rows: 3 }} /> :
                                <Checkbox.Group value={organizations} onChange={(value) => (setOrganizations(value))}>
                                    <Space direction='vertical'>
                                        {facultyOptions.map((faculty) => (
                                            <Checkbox key={faculty.faculty_id} value={faculty.faculty_id}>
                                                {`${faculty.faculty_short} (${faculty.faculty_name})`} 
                                                <span style={{ color: '#00000073' }}> ({datasetList.filter((dataset) => (dataset.faculty_id === faculty.faculty_id)).length})</span>
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            }
                        </Card>
                        <Card 
                            title={<Space><TagOutlined />Tags</Space>} 
                            actions={[
                                <Link href='#' onClick={(e) => {
                                    e.preventDefault();
                                    setTags(tagOptions.map((tag) => (tag.tag_name)));
                                }}>
                                    Select all
                                </Link>,
                                <Link href='#' onClick={(e) => {
                                    e.preventDefault();
                                    setTags([]);
                                }}>
                                    Clear all
                                </Link>,
                            ]}
                        >
                            { isFilterLoading ? <Skeleton active paragraph={{ rows: 3 }} /> :
                                <Checkbox.Group value={tags} onChange={(value) => (setTags(value))}>
                                    <Space direction='vertical'>
                                        {tagOptions.map((tag, index) => (
                                            <Checkbox key={index} value={tag.tag_name}>
                                                {tag.tag_name}
                                                <span style={{ color: '#00000073' }}> ({datasetList.filter((dataset) => (dataset.tags.includes(tag.tag_name))).length})</span>
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            }
                        </Card>
                        <Card 
                            title={<Space><TranslationOutlined />Data Languages</Space>}
                            actions={[
                                <Link href='#' onClick={(e) => {
                                    e.preventDefault();
                                    setDataLanguages(['English', 'Thai', 'Others']);
                                }}>
                                    Select all
                                </Link>,
                                <Link href='#' onClick={(e) => {
                                    e.preventDefault();
                                    setDataLanguages([]);
                                }}>
                                    Clear all
                                </Link>,
                            ]}
                        >
                            { isFilterLoading ? <Skeleton active paragraph={{ rows: 3 }} /> : 
                                <Checkbox.Group value={dataLanguages} onChange={(value) => (setDataLanguages(value))}>
                                    <Space direction='vertical'>
                                        <Checkbox value='English'>
                                            English <span style={{ color: '#00000073' }}>
                                            ({datasetList.filter((dataset) => (dataset.data_lang === 'English')).length})
                                            </span>
                                        </Checkbox>
                                        <Checkbox value='Thai'>
                                            Thai <span style={{ color: '#00000073' }}>
                                            ({datasetList.filter((dataset) => (dataset.data_lang === 'Thai')).length})
                                            </span>
                                        </Checkbox>
                                        <Checkbox value='Others'>
                                            Others <span style={{ color: '#00000073' }}>
                                            ({datasetList.filter((dataset) => (dataset.data_lang === 'Others')).length})
                                            </span>
                                        </Checkbox>
                                    </Space>
                                </Checkbox.Group>
                            }
                        </Card>
                    </Space>
                </Col>
                <Col span={18}>
                    <Space direction='vertical' style={{ display: 'flex' }}>
                        {isLoading ? 
                            Array.from({ length: 10 }).map((_, index) => (
                                <Card key={index}>
                                    <Skeleton active paragraph={{ rows: 2 }} />
                                </Card>
                            )) : 
                            currentData.length === 0 ? <Empty style={{ margin: '50px 0' }} /> :
                            currentData.map((dataset) => (
                                <DatasetCard key={dataset.dataset_id} dataset={dataset} />
                            ))
                        }
                        <Row justify='end' style={{ paddingTop: '16px'}}>
                            <Col>
                                <Pagination
                                    current={currentPage}
                                    total={datasetList.length}
                                    pageSize={pageSize}
                                    showSizeChanger
                                    showQuickJumper
                                    showTotal={(total) => `Total ${total} items`}
                                    onChange={handlePageChange}
                                    onShowSizeChange={handleSizeChange}
                                />
                            </Col>
                        </Row>
                    </Space>
                </Col>
            </Row>
        </Content>
    );
}