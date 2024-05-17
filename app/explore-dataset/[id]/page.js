'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import _ from 'lodash';

import { Spin } from 'antd';
import PageHeader from '@/components/dataset/header-explore';
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
    const { data: session, status } = useSession();
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
            setDatasetData({ ...data.data, total_size: _.sumBy(data.data.tables, 'table_size') });
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const fetchLogView = async () => {
        try {
            const body = { dataset_id: params.id, user_id: session.user.name, status: 'Success' };
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=VIEW`, body);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetData();
        fetchLogView();
    }, []);

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }
    
    return (
        isLoading ? <Spin fullscreen /> :
        <>
            <PageHeader dataset={datasetData} tabs={tab_items} onTabChange={handleChange} />
            <PageContent dataset={datasetData} tab={tabState} />
        </>
    );
}