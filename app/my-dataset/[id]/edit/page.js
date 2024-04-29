'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Spin } from 'antd';
import PageHeader from '@/components/edit-dataset/header';
import PageContent from '@/components/edit-dataset/content';

const tab_items = [
    {
        label: 'Dataset Info',
        key: 'dataset_info'
    },
    {
        label: 'Data Table',
        key: 'data_table'
    }
];

export default function EditDataset({ params }) {
    const [tabState, setTabState] = useState(tab_items[0].key);
    const [datasetData, setDatasetData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (key) => {
        setTabState(key);
    };

    const fetchDatasetData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${params.id}`);
            const data = response.data;
            setDatasetData(data.data);
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetData();
    }, []);

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        isLoading ? <Spin fullscreen /> :
        <>
            <PageHeader dataset_id={params.id} tabs={tab_items} onTabChange={handleChange} />
            <PageContent dataset={datasetData} tab={tabState} fetchDatasetData={fetchDatasetData} />
        </>
    );
}