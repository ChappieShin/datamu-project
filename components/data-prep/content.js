'use client'

import { useState } from 'react';
import { Layout, Space, Typography, Card, Tabs, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ToolBar from './tool-bar';
import DataTable from './data-table';

const { Content } = Layout;
const { Title } = Typography;

export default function PageContent({ dataset, fetchDataset }) {
    const [tablesData, setTablesData] = useState(dataset.tables);

    const tab_items = tablesData.map((table) => (
        { label: table.table_name, key: table.table_id }
    ));

    const [tableKey, setTableKey] = useState(tab_items[0].key);

    const handleChange = (key) => {
        setTableKey(key);
    };

    return (
        <Content style={{ padding: '24px' }}>
            <Card title={<ToolBar dataset={tablesData} setDataset={setTablesData} dataset_id={dataset.dataset_id} owner_id={dataset.owner_id} table_id={tableKey} set_table_id={setTableKey} fetchDataset={fetchDataset} existing_dataset={dataset.tables} />}>
                <Card.Grid hoverable={false} style={{ width: '75%' }}>
                    <DataTable table={tablesData.find((table) => (table.table_id === tableKey))} />
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: '25%' }}>
                    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 0 }}>Tables</Title>
                        <Tabs
                            activeKey={tableKey}
                            items={tab_items}
                            tabPosition='right'
                            onChange={handleChange}
                            tabBarStyle={{ width: '100%' }}
                        />
                    </Space>
                </Card.Grid>
            </Card>
        </Content>
    );
}