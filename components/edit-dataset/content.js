'use client'

import { Layout, Row } from 'antd';
import DatasetInfo from './dataset-info';
import DataTable from './data-table';

const { Content } = Layout;

export default function PageContent({ dataset, tab, fetchDatasetData }) {
    return (
        <Content style={{ padding: '24px' }}>
            <Row justify='center'>
                {tab === 'dataset_info' ? (
                    <DatasetInfo dataset={dataset} />
                ) : tab === 'data_table' ? (
                    <DataTable dataset={dataset} fetchDatasetData={fetchDatasetData} />
                ) : (
                    null
                )}
            </Row>
        </Content>
    );
}