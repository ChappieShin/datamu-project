'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { message } from 'antd';
import _ from 'lodash';

import PageHeader from '@/components/explore-dataset/header';
import PageContent from '@/components/explore-dataset/content';

export default function ExploreDataset() {
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            const data = response.data;
            if (!data.error) {
                let new_data = data.data.map((dataset) => ({ ...dataset, total_size: _.sumBy(dataset.tables, 'table_size') }));
                new_data = new_data.filter((dataset) => (dataset.permission_type === 'Public' || (dataset.permission_type === 'Private' && dataset.owner_id === session.user.name)))
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
    const [permissionOption, setPermissionOption] = useState('all');
    const [sortOption, setSortOption] = useState('none');
    const [organizations, setOrganizations] = useState([]);
    const [tags, setTags] = useState([]);
    const [dataLanguages, setDataLanguages] = useState([]);

    const handleFilterDataset = async (keyword, permission, sort, org, tags, data_lang) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets?user_id=${session.user.name}&search_keyword=${keyword}&permission_type=${permission}&sort_option=${sort}&organizations=${org}&tags=${tags}&data_lang=${data_lang}`);
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
        handleFilterDataset(searchKeyword, permissionOption, sortOption, organizations, tags, dataLanguages);
    }, [searchKeyword, permissionOption, sortOption, organizations, tags, dataLanguages]);
    
    return (
        <>
            <PageHeader 
                datasetList={datasetList} 
                setSearchKeyword={setSearchKeyword} 
                permissionOption={permissionOption} 
                setPermissionOption={setPermissionOption}
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