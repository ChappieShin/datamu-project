'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Spin, message } from 'antd';
import PageHeader from '@/components/data-viz/header';
import PageContent from '@/components/data-viz/content';

export default function DataViz({ params }) {
    const [datasetData, setDatasetData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchDatasetData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/datasets/${params.id}`);
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

    return (
        isLoading ? <Spin fullscreen /> :
        <>
            <PageHeader dataset_id={params.id} />
            <PageContent dataset={datasetData} />
        </>
    );
}