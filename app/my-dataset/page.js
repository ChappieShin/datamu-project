'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
    const [isLoading, setIsLoading] = useState(true);
    
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query'));

    const [sortOption, setSortOption] = useState('none');
    const [organizations, setOrganizations] = useState([]);
    const [tags, setTags] = useState([]);
    const [dataLanguages, setDataLanguages] = useState([]);

    const fetchDatasetList = async (keyword) => {
        try {
            setIsLoading(true);
            let response;
            if (keyword) {
                response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets?user_id=${session.user.name}&search_keyword=${keyword.toLowerCase()}`);
            }
            else {
                response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets?user_id=${session.user.name}`);
            }
            const data = response.data;
            if (!data.error) {
                let new_data = data.data.map((dataset) => ({ ...dataset, total_size: _.sumBy(dataset.tables, 'table_size') }));

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
        router.push(`/my-dataset?query=${encodeURIComponent(keyword)}`);
        setQuery(keyword);
    };

    useEffect(() => {
        fetchDatasetList(query);
    }, [query, sortOption, organizations, tags, dataLanguages]);

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }
    
    return (
        <>
            <PageHeader 
                datasetList={datasetList} 
                searchKeyword={query}
                handleSearch={handleSearchDataset}
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