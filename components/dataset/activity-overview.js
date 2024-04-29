import { useState, useEffect } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import _ from 'lodash';
import dayjs from 'dayjs';

import { Row, Card, Skeleton, Statistic, Divider, Col, Space, Spin } from 'antd';
import { EyeOutlined, CalendarOutlined, ArrowDownOutlined, ArrowUpOutlined, FileExcelOutlined, FileTextOutlined, ApiOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/charts';

const formatter = (value) => <CountUp end={value} />;

export default function ActivityOverview({ dataset_id }) {
    const [viewData, setViewData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [apiData, setApiData] = useState([]);
    const [isLoadingView, setIsLoadingView] = useState(true);
    const [isLoadingExport, setIsLoadingExport] = useState(true);

    const fetchViewData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/logs/${dataset_id}?log_type=VIEW`);
            console.log(response)
            const data = response.data;
            setViewData(data.data);
            setIsLoadingView(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchExportData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/logs/${dataset_id}?log_type=EXPORT`);
            const data = response.data;
            setExcelData(data.data.filter((d) => (d.export_format === 'xlsx')));
            setCsvData(data.data.filter((d) => (d.export_format === 'csv')));
            setApiData(data.data.filter((d) => (d.export_format === 'API')));
            setIsLoadingExport(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
       fetchViewData();
       fetchExportData();
    }, []);

    return ( !isLoadingView && !isLoadingExport &&
        <Card title='Activity Overview'>
            { viewData.length > 0 &&
                <Card.Grid hoverable={false} style={{ width: '25%' }}>
                    <Area
                        height={200}
                        data={viewData} 
                        xField={(d) => new Date(d.view_date)} 
                        yField='Number of view(s)' 
                        shapeField='smooth'
                    />
                    <Row justify='space-around'>
                        <Col>
                            <Statistic 
                                title={<Space><EyeOutlined />Total Views</Space>} 
                                value={_.sumBy(viewData, 'Number of view(s)')} 
                                formatter={formatter} 
                            />
                        </Col>
                        <Col>
                            <Divider type='vertical' style={{ height: '100%', margin: 0 }} />
                        </Col>
                        <Col>
                            <Statistic 
                                title={<Space><CalendarOutlined />Daily Views</Space>} 
                                value={viewData.find((d) => (dayjs(d.view_date).isSame(dayjs(), 'day'))) ? viewData.find((d) => (dayjs(d.view_date).isSame(dayjs(), 'day')))['Number of view(s)'] : 0} 
                                formatter={formatter} 
                                // prefix={
                                //     viewData.find((d) => (dayjs(d.view_date).isSame(dayjs(), 'day')))['Number of view(s)'] > viewData.find((d) => (dayjs(d.view_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of view(s)'] ?
                                //     <ArrowUpOutlined /> : viewData.find((d) => (dayjs(d.view_date).isSame(dayjs(), 'day')))['Number of view(s)'] < viewData.find((d) => (dayjs(d.view_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of view(s)'] ? 
                                //     <ArrowDownOutlined /> : undefined
                                // }
                                // valueStyle={{
                                //     color: viewData.find((d) => (dayjs(d.view_date).isSame(dayjs(), 'day')))['Number of view(s)'] > viewData.find((d) => (dayjs(d.view_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of view(s)'] ?
                                //             '#3f8600' : viewData.find((d) => (dayjs(d.view_date).isSame(dayjs(), 'day')))['Number of view(s)'] < viewData.find((d) => (dayjs(d.view_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of view(s)'] ? 
                                //             '#cf1322' : undefined
                                // }}
                            />
                        </Col>
                    </Row>
                </Card.Grid>
            }
            { excelData.length > 0 &&
                <Card.Grid hoverable={false} style={{ width: '25%' }}>
                    <Area
                        height={200}
                        data={excelData} 
                        xField={(d) => new Date(d.export_date)}
                        yField='Number of export(s)'
                        shapeField='smooth'
                        style={{ fill: 'green' }}
                    />
                    <Row justify='space-around'>
                        <Col>
                            <Statistic 
                                title={<Space><FileExcelOutlined />Export (Excel)</Space>} 
                                value={_.sumBy(excelData, 'Number of export(s)')} 
                                formatter={formatter} 
                            />
                        </Col>
                        <Col>
                            <Divider type='vertical' style={{ height: '100%', margin: 0 }} />
                        </Col>
                        <Col>
                            <Statistic 
                                title={<Space><CalendarOutlined />Daily Exports</Space>} 
                                value={excelData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day'))) ? excelData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] : 0} 
                                formatter={formatter} 
                                // prefix={
                                //     excelData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] > excelData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ?
                                //     <ArrowUpOutlined /> : excelData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] < excelData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ? 
                                //     <ArrowDownOutlined /> : undefined
                                // }
                                // valueStyle={{
                                //     color: excelData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] > excelData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ?
                                //             '#3f8600' : excelData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] < excelData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ? 
                                //             '#cf1322' : undefined
                                // }}
                            />
                        </Col>
                    </Row>
                </Card.Grid>
            }
            { csvData.length > 0 &&
                <Card.Grid hoverable={false} style={{ width: '25%' }}>
                    <Area
                        height={200}
                        data={csvData} 
                        xField={(d) => new Date(d.export_date)}
                        yField='Number of export(s)'
                        shapeField='smooth'
                        style={{ fill: 'orange' }}
                    />
                    <Row justify='space-around'>
                        <Col>
                            <Statistic 
                                title={<Space><FileTextOutlined />Export (CSV)</Space>} 
                                value={_.sumBy(csvData, 'Number of export(s)')} 
                                formatter={formatter} 
                            />
                        </Col>
                        <Col>
                            <Divider type='vertical' style={{ height: '100%', margin: 0 }} />
                        </Col>
                        <Col>
                            <Statistic 
                                title={<Space><CalendarOutlined />Daily Exports</Space>} 
                                value={csvData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day'))) ? csvData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] : 0} 
                                formatter={formatter} 
                                // prefix={
                                //     csvData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] > csvData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ?
                                //     <ArrowUpOutlined /> : csvData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] < csvData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ? 
                                //     <ArrowDownOutlined /> : undefined
                                // }
                                // valueStyle={{
                                //     color: csvData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] > csvData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ?
                                //             '#3f8600' : csvData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] < csvData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ? 
                                //             '#cf1322' : undefined
                                // }}
                            />
                        </Col>
                    </Row>
                </Card.Grid>
            }
            { apiData.length > 0 &&
                <Card.Grid hoverable={false} style={{ width: '25%' }}>
                    <Area
                        height={200}
                        data={apiData} 
                        xField={(d) => new Date(d.export_date)}
                        yField='Number of export(s)'
                        shapeField='smooth'
                        style={{ fill: 'red' }}
                    />
                    <Row justify='space-around'>
                        <Col>
                            <Statistic 
                                title={<Space><ApiOutlined />Export (API)</Space>} 
                                value={_.sumBy(apiData, 'Number of export(s)')} 
                                formatter={formatter} 
                            />
                        </Col>
                        <Col>
                            <Divider type='vertical' style={{ height: '100%', margin: 0 }} />
                        </Col>
                        <Col>
                            <Statistic 
                                title={<Space><CalendarOutlined />Daily Exports</Space>} 
                                value={apiData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day'))) ? apiData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] : 0} 
                                formatter={formatter} 
                                // prefix={
                                //     apiData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] > apiData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ?
                                //     <ArrowUpOutlined /> : apiData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] < apiData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ? 
                                //     <ArrowDownOutlined /> : undefined
                                // }
                                // valueStyle={{
                                //     color: apiData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] > apiData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ?
                                //             '#3f8600' : apiData.find((d) => (dayjs(d.export_date).isSame(dayjs(), 'day')))['Number of export(s)'] < apiData.find((d) => (dayjs(d.export_date).isSame(dayjs().subtract(1, 'day'), 'day')))['Number of export(s)'] ? 
                                //             '#cf1322' : undefined
                                // }}
                            />
                        </Col>
                    </Row>
                </Card.Grid>
            }   
            </Card>
    );
}