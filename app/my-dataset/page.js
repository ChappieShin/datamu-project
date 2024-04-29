'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import _ from 'lodash';

import { message } from 'antd';
import PageHeader from '@/components/my-dataset/header';
import PageContent from '@/components/my-dataset/content';

export default function MyDataset() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [router, status]);

    const [datasetList, setDatasetList] = useState([]);

    const fetchDatasetList = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/datasets?user_id=${session.user.name}`);
            const data = response.data;
            if (!data.error) {
                const new_data = data.data.map((dataset) => ({ ...dataset, total_size: _.sumBy(dataset.tables, 'table_size') }));
                setDatasetList(new_data);
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetList();
    }, []);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortOption, setSortOption] = useState('none');
    const [organizations, setOrganizations] = useState([]);
    const [tags, setTags] = useState([]);
    const [dataLanguages, setDataLanguages] = useState([]);

    const handleFilterDataset = async (keyword, sort, org, tags, data_lang) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/datasets?user_id=${session.user.name}&search_keyword=${keyword}&sort_option=${sort}&organizations=${org}&tags=${tags}&data_lang=${data_lang}`);
            const data = response.data;
            if (!data.error) {
                const new_data = data.data.map((dataset) => ({ ...dataset, total_size: _.sumBy(dataset.tables, 'table_size') }));
                setDatasetList(new_data);
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => { 
        handleFilterDataset(searchKeyword, sortOption, organizations, tags, dataLanguages);
    }, [searchKeyword, sortOption, organizations, tags, dataLanguages]);

    return (
        <>
            <PageHeader 
                datasetList={datasetList}
                setSearchKeyword={setSearchKeyword} 
                sortOption={sortOption}
                setSortOption={setSortOption}
            />
            <PageContent 
                datasetList={datasetList}
                fetchDatasetList={fetchDatasetList}
                organizations={organizations}
                setOrganizations={setOrganizations}
                tags={tags}
                setTags={setTags}
                dataLanguages={dataLanguages}
                setDataLanguages={setDataLanguages}
                user_id={session.user.name}
            />
        </>
    );
}