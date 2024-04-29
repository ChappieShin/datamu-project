import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Result, Button, Spin } from 'antd';
import { filesize } from 'filesize';
import _ from 'lodash';

export default function DonePage({ datasetForm }) {
    const [datasetData, setDatasetData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchDatasetData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${datasetForm.dataset_id}`);
            const data = response.data;
            setDatasetData({ ...data.data, total_size: _.sumBy(data.data.tables, 'table_size') });
            setIsLoading(false);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchDatasetData();
    }, []);

    return (
        isLoading ? <Spin fullscreen /> :
        <Result
            status='success'
            title='Successfully created the dataset'
            subTitle={`Dataset ID: ${datasetData.dataset_id} - ${datasetData.title} (${datasetData.num_tables} Tables · ${filesize(datasetData.total_size)})`}
            extra={[
                <Link href={`/my-dataset/${datasetData.dataset_id}`}>
                    <Button type='primary'>Go Dataset</Button>
                </Link>,
                <Link href='/my-dataset'>
                    <Button>Back My Dataset</Button>
                </Link>
            ]}
        />
    );
}