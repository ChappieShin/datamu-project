'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Spin, message } from 'antd';
import PageHeader from '@/components/export-dataset/header';
import PageContent from '@/components/export-dataset/content';

export default function ExportDataset({ params }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [router, status]);

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
            <PageHeader dataset_id={params.id} />
            <PageContent dataset={datasetData} user_id={session.user.name} />
        </>
    );
}