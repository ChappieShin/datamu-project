import { useState } from 'react';
import { Space, Typography, Card, Tabs } from 'antd';
import { filesize } from 'filesize';
import DataTable from './data-table';

const { Title, Text } = Typography;

export default function DataExplorer({ dataset }) {
    const tab_items = dataset.tables.map((table) => (
        { label: `${table.table_name} (${filesize(table.table_size)})`, key: table.table_id }
    ));
    
    const [tableKey, setTableKey] = useState(tab_items[0].key);

    const handleChange = (key) => {
        setTableKey(key);
    };

    return (
        <Card title='Data Explorer'>
            <Card.Grid hoverable={false} style={{ width: '75%' }}>
                <DataTable table={dataset.tables.find((table) => (table.table_id === tableKey))} />
            </Card.Grid>
            <Card.Grid hoverable={false} style={{ width: '25%' }}>
                <Space direction='vertical' size='middle'>
                    <Title level={4} style={{ margin: 0 }}>
                        {`${dataset.num_tables} Tables `}
                        <Text type='secondary' style={{ fontSize: '16px', fontWeight: 'normal' }}>
                            {`(${filesize(dataset.total_size)})`}
                        </Text>
                    </Title>
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
    );
}