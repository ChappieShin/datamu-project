'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Spin, message } from 'antd';
import PageHeader from '@/components/edit-tag/header';
import PageContent from '@/components/edit-tag/content';

export default function EditTag({ params }) {
    const [tagData, setTagData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchTagData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/tags/${params.id}`);
            const data = response.data;
            if (!data.error) {
                setTagData(data.data[0]);
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
        fetchTagData();
    }, []);

    return (
        isLoading ? <Spin fullscreen /> :
        <>
            <PageHeader tag_id={params.id} />
            <PageContent tag={tagData} />
        </>
    );
}