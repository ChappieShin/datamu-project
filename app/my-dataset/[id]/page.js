'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Spin } from 'antd';
import _ from 'lodash';
import PageHeader from '@/components/dataset/header-my';
import PageContent from '@/components/dataset/content';

const tab_items = [
    {
        label: 'Description',
        key: 'data_desc'
    },
    {
        label: 'Data Explorer',
        key: 'data_explorer'
    },
    {
        label: 'Metadata',
        key: 'metadata'
    }
];

export default function Dataset({ params }) {
    const [tabState, setTabState] = useState(tab_items[0].key);
    const [datasetData, setDatasetData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (key) => {
        setTabState(key);
    };

    const fetchDatasetData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/datasets/${params.id}`);
            const data = response.data;
            setDatasetData({ ...data.data, total_size: _.sumBy(data.data.tables, 'table_size') });
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetData();
    }, []);
    
    return (
        isLoading ? <Spin fullscreen /> :
        <>
            <PageHeader dataset={datasetData} tabs={tab_items} onTabChange={handleChange} />
            <PageContent dataset={datasetData} tab={tabState} />
        </>
    );
}