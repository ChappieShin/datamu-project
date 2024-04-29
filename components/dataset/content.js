'use client'

import { Layout } from 'antd';
import Description from './description';
import DataExplorer from './data-explorer';
import Metadata from './metadata';

const { Content } = Layout;

export default function PageContent({ dataset, tab }) {
    return (
        <Content style={{ padding: '24px' }}>
            {tab === 'data_desc' ? (
                <Description dataset={dataset} />
            ) : tab === 'data_explorer' ? (
                <DataExplorer dataset={dataset} />
            ) : tab === 'metadata' ? (
                <Metadata dataset={dataset} />
            ) : (
                null
            )}
        </Content>
    );
}