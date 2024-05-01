import { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Card, Radio, Skeleton, Empty } from 'antd';
import { BankOutlined, TagOutlined, TranslationOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import _ from 'lodash';

export default function DonutCard() {
    const [chartOption, setChartOption] = useState('organization');
    const [totalDataset, setTotalDataset] = useState(0);
    const [facultyCountData, setFacultyCountData] = useState([]);
    const [tagCountData, setTagCountData] = useState([]);
    const [dataLangCountData, setDataLangCountData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCountDataset = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            const data = response.data;
            setTotalDataset(data.data.length);

            const grouped_data = _.groupBy(data.data, 'data_lang');
            const count_data_lang = _.map(grouped_data, (group, name) => ({ data_lang: name, ['Number of dataset(s)']: group.length }));
            setDataLangCountData(count_data_lang);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchFacultyCountData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faculties?count_datasets=true`);
            const data = response.data;
            setFacultyCountData(data.data.filter((faculty) => (faculty['Number of dataset(s)'] > 0)));
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchTagCountData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
            const data = response.data;
            setTagCountData(data.data.filter((tag) => (tag['Number of dataset(s)'] > 0)));
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        Promise.all([fetchCountDataset(), fetchFacultyCountData(), fetchTagCountData()])
        .then(() => {
            setIsLoading(false);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
        });
    }, []);

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

    const config = {
        data: chartOption === 'organization' ? facultyCountData : chartOption === 'tag' ? tagCountData : chartOption === 'data_lang' ? dataLangCountData : undefined,
        colorField: chartOption === 'organization' ? 'faculty_short' : chartOption === 'tag' ? 'tag_name' : chartOption === 'data_lang' ? 'data_lang' : undefined,
        angleField: 'Number of dataset(s)',
        radius: 0.9,
        innerRadius: 0.7,
        style: {
            inset: 1
        },
        tooltip: {
            title: (d) => chartOption === 'organization' ? (d['faculty_short'] + ' (' + d['faculty_name'] + ')') : 
                            chartOption === 'tag' ? d['tag_name'] : 
                            chartOption === 'data_lang' ? d['data_lang'] : 
                            undefined
        },
        state: {
            active: { opacity: 1 },
            inactive: { opacity: 0.5 }
        },
        interaction: {
            elementHighlight: true
        },
        legend: {
            color: {
                itemMarker: 'circle',
                position: 'bottom',
                layout: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }
            }
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: 'Total Datasets',
                    x: '50%',
                    y: '46%',
                    textAlign: 'center',
                    fontSize: 14,
                    fill: '#00000073'
                }
            },
            {
                type: 'text',
                style: {
                    text: totalDataset.toString(),
                    x: '50%',
                    y: '54%',
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: 'bold',
                }
            }
        ],
        // style: {
        //     fill: (d) => chartOption === 'organization' ? d.faculty_color : chartOption === 'tag' ? string2color(d.tag_name) : undefined
        // }
    };

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <Card
            title='Dataset by'
            extra={
                <Radio.Group size='small' value={chartOption} onChange={(e) => (setChartOption(e.target.value))}>
                    <Radio.Button value='organization'>
                        <BankOutlined /> {chartOption === 'organization' && 'Organization'}
                    </Radio.Button>
                    <Radio.Button value='tag'>
                        <TagOutlined /> {chartOption === 'tag' && 'Tag'}
                    </Radio.Button>
                    <Radio.Button value='data_lang'>
                        <TranslationOutlined /> {chartOption === 'data_lang' && 'Data Language'}
                    </Radio.Button>
                </Radio.Group>
            }
            style={{ height: '100%' }}
        >
            <Row justify='center'>
                { isLoading ? <Skeleton active paragraph={{ rows: 12 }} /> :
                    config.data.length === 0 ? <Empty /> :
                    <Pie {...config} width={300} />
                }
            </Row>
        </Card>
    );
}