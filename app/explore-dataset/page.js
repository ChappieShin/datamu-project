'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
    const [isLoading, setIsLoading] = useState(true);
    
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query'));

    const [permissionOption, setPermissionOption] = useState('all');
    const [sortOption, setSortOption] = useState('none');
    const [organizations, setOrganizations] = useState([]);
    const [tags, setTags] = useState([]);
    const [dataLanguages, setDataLanguages] = useState([]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.name}`);
            const data = response.data;
            return data.data[0];
        } catch (error) {
            console.log('Error', error);
        }
    };
    
    const fetchDatasetList = async (keyword) => {
        try {
            setIsLoading(true);
            let response;
            if (keyword) {
                response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets?search_keyword=${keyword.toLowerCase()}`);
            }
            else {
                response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`);
            }
            const data = response.data;
            if (!data.error) {
                let new_data = data.data.map((dataset) => ({ ...dataset, total_size: _.sumBy(dataset.tables, 'table_size') }));

                // Permission
                const user = await fetchUserData();
                if (permissionOption === 'all') {
                    new_data = new_data.filter((dataset) => (
                        (dataset.permission_type === 'Private' && dataset.owner_id === user.user_id) ||
                        (dataset.permission_type === 'Public') ||
                        (dataset.permission_type === 'Faculty' && dataset.faculty_id === user.faculty_id) ||
                        (dataset.permission_type === 'Unit' && dataset.unit_id === user.unit_id) ||
                        (dataset.permission_type === 'Division' && dataset.division_id === user.division_id)
                    ));
                }
                else if (permissionOption === 'owned') {
                    new_data = new_data.filter((dataset) => (
                        (dataset.owner_id === user.user_id)
                    ));
                }
                else if (permissionOption === 'shared') {
                    new_data = new_data.filter((dataset) => (
                        (dataset.owner_id !== user.user_id) && (
                        (dataset.permission_type === 'Public') ||
                        (dataset.permission_type === 'Faculty' && dataset.faculty_id === user.faculty_id) ||
                        (dataset.permission_type === 'Unit' && dataset.unit_id === user.unit_id) ||
                        (dataset.permission_type === 'Division' && dataset.division_id === user.division_id))
                    ));
                }

                // Organizations
                if (organizations.length > 0) {
                    new_data = new_data.filter((dataset) => (organizations.includes(dataset.faculty_id)));
                }

                // Tags
                if (tags.length > 0) {
                    new_data = new_data.filter((dataset) =>
                        dataset.tags.split(',').some((tag) => (tags.includes(tag)))
                    );
                }

                // Data languages
                if (dataLanguages.length > 0) {
                    new_data = new_data.filter((dataset) => (dataLanguages.includes(dataset.data_lang)))
                }
                
                // Sort by
                if (sortOption === 'none') {
                    new_data.sort((a, b) => (a.dataset_id - b.dataset_id));
                }
                else if (sortOption === 'name_asc') {
                    new_data.sort((a, b) => (a.title.localeCompare(b.title)));
                }
                else if (sortOption === 'name_desc') {
                    new_data.sort((a, b) => (b.title.localeCompare(a.title)));
                }
                else if (sortOption === 'modified_asc') {
                    new_data.sort((a, b) => (new Date(a.modified_date) - new Date(b.modified_date)));
                }
                else if (sortOption === 'modified_desc') {
                    new_data.sort((a, b) => (new Date(b.modified_date) - new Date(a.modified_date)));
                }
                else if (sortOption === 'most_viewed') {
                    new_data.sort((a, b) => (b.view_count - a.view_count));
                }
                else if (sortOption === 'most_exported') {
                    new_data.sort((a, b) => (b.export_count - a.export_count));
                }
                setDatasetList(new_data);
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
    
    const handleSearchDataset = (keyword) => {
        router.push(`/explore-dataset?query=${encodeURIComponent(keyword)}`);
        setQuery(keyword);
    };

    useEffect(() => {
        fetchDatasetList(query);
    }, [query, permissionOption, sortOption, organizations, tags, dataLanguages]);
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }
    
    return (
        <>
            <PageHeader 
                datasetList={datasetList} 
                searchKeyword={query}
                handleSearch={handleSearchDataset}
                permissionOption={permissionOption}
                setPermissionOption={setPermissionOption}
                sortOption={sortOption}
                setSortOption={setSortOption}
            />
            <PageContent 
                datasetList={datasetList}
                isLoading={isLoading}
                organizations={organizations}
                setOrganizations={setOrganizations}
                tags={tags}
                setTags={setTags}
                dataLanguages={dataLanguages}
                setDataLanguages={setDataLanguages}
            />
        </>
    );
}