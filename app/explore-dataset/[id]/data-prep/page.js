'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Spin, message } from 'antd';
import PageHeader from '@/components/data-prep/header';
import PageContent from '@/components/data-prep/content';

export default function DataViz({ params }) {
    const [datasetData, setDatasetData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchDatasetData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${params.id}`);
            const data = response.data;
            if (!data.error) {
                setDatasetData(data.data);
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        } finally {
            setIsLoading(false);
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
            <PageHeader dataset={datasetData} />
            <PageContent dataset={datasetData} fetchDataset={fetchDatasetData} />
        </>
    );
}