import { Row, Col, Space, Typography, Table } from 'antd';
import { filesize } from 'filesize';
import DatatypeChecker from '../etc/datatype-checker';

const { Title, Text } = Typography;

export default function DataTable({ table }) {
    const column_items = Object.keys(table.data[0]).map((col, index) => ({
        title: <DatatypeChecker col_name={col} col_data={table.data[0][col]} />,
        dataIndex: col,
        key: index,
        width: 200,
        render: (_, record) => (record[col] && record[col].toString())
    }));
    
    return (
        <Table
            columns={column_items}
            dataSource={table.data.map((item, index) => ({ ...item, key: index }))}
            title={() => (
                <Row justify='space-between'>
                    <Col>
                        <Space direction='vertical'>
                            <Title level={5} style={{ margin: 0 }}>
                                {table.table_name + ' '}
                                <Text type='secondary' style={{ fontWeight: 'normal' }}>
                                    {`(${filesize(table.table_size)})`}
                                </Text>
                            </Title>
                            <Text type='secondary'>{table.description}</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space direction='vertical' style={{ textAlign: 'right' }}>
                            <Text>{`${table.num_cols} Columns | ${table.num_rows} Rows`}</Text>
                            <Text type='secondary'>
                                {`Last Updated: ${new Date(table.updated_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`}
                            </Text>
                        </Space>
                    </Col>
                </Row>
            )}
            pagination={false}
            bordered
            scroll={{ x: 'max-content', y: 500 }}
        />
    );
}