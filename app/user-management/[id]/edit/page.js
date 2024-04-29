'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

import { Spin, message } from 'antd';
import PageHeader from '@/components/edit-user/header';
import PageContent from '@/components/edit-user/content';

export default function EditUser({ params }) {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.id}`);
            const data = response.data;
            if (!data.error) {
                setUserData(data.data[0]);
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
        fetchUserData();
    }, []);

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        isLoading ? <Spin fullscreen /> :
        <>
            <PageHeader user_id={params.id} />
            <PageContent user={userData} />
        </>
    );
}