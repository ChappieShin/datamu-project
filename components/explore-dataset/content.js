'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Space, Typography, Card, Pagination, Empty, Checkbox } from 'antd';
import { BankOutlined, TagOutlined, TranslationOutlined } from '@ant-design/icons';
import DatasetCard from './card-dataset';

const { Content } = Layout;
const { Link } = Typography;

export default function PageContent({ datasetList, organizations, setOrganizations, tags, setTags, dataLanguages, setDataLanguages, user_id }) {
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [dataLangOptions, setDataLangOptions] = useState([]);

    const fetchFacultyOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faculties?count_datasets=true`);
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

    const fetchDataLangOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/data_lang`);
            const data = response.data;
            setDataLangOptions(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchFacultyOptions();
        fetchTagOptions();
        fetchDataLangOptions();
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
                        >
                            <Checkbox.Group value={organizations} onChange={(value) => (setOrganizations(value))}>
                                <Space direction='vertical'>
                                    {facultyOptions.map((faculty) => (
                                        <Checkbox value={faculty.faculty_id}>
                                            {`${faculty.faculty_short} (${faculty.faculty_name})`} <span style={{ color: '#00000073' }}>({faculty['Number of dataset(s)']})</span>
                                        </Checkbox>
                                    ))}
                                </Space>
                            </Checkbox.Group>
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
                            <Checkbox.Group value={tags} onChange={(value) => (setTags(value))}>
                                <Space direction='vertical'>
                                    {tagOptions.map((tag) => (
                                        <Checkbox value={tag.tag_name}>
                                            {tag.tag_name} <span style={{ color: '#00000073' }}>({tag['Number of dataset(s)']})</span>
                                        </Checkbox>
                                    ))}
                                </Space>
                            </Checkbox.Group>
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
                            <Checkbox.Group value={dataLanguages} onChange={(value) => (setDataLanguages(value))}>
                                <Space direction='vertical'>
                                    <Checkbox value='English'>
                                        English <span style={{ color: '#00000073' }}>
                                            ({
                                                dataLangOptions.find((lang) => lang.data_lang === 'English')
                                                    ? dataLangOptions.find((lang) => lang.data_lang === 'English')['Number of dataset(s)']
                                                    : 0
                                            })
                                        </span>
                                    </Checkbox>
                                    <Checkbox value='Thai'>
                                        Thai <span style={{ color: '#00000073' }}>
                                            ({
                                                dataLangOptions.find((lang) => lang.data_lang === 'Thai')
                                                    ? dataLangOptions.find((lang) => lang.data_lang === 'Thai')['Number of dataset(s)']
                                                    : 0
                                            })
                                        </span>
                                    </Checkbox>
                                    <Checkbox value='Others'>
                                        Others <span style={{ color: '#00000073' }}>
                                            ({
                                                dataLangOptions.find((lang) => lang.data_lang === 'Others')
                                                    ? dataLangOptions.find((lang) => lang.data_lang === 'Others')['Number of dataset(s)']
                                                    : 0
                                            })
                                        </span>
                                    </Checkbox>
                                </Space>
                            </Checkbox.Group>
                        </Card>
                    </Space>
                </Col>
                <Col span={18}>
                    <Space direction='vertical' style={{ display: 'flex' }}>
                        { currentData.length === 0 ? <Empty /> :
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