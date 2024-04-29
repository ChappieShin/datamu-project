import { Row, Col, Space, Typography, Table } from 'antd';
import DatatypeChecker from '../etc/datatype-checker';

const { Title, Text } = Typography;

export default function DataTable({ table }) {
    const column_items = Object.keys(table.data[0]).map((col, index) => ({
        title: <DatatypeChecker col_name={col} col_data={table.data[0][col]} />,
        dataIndex: col,
        key: index,
        width: 200,
        render: (_, record) => (record[col] && record[col])
    }));

    return (
        <Table
            columns={column_items}
            dataSource={table.data.map((item, index) => ({ ...item, key: index }))}
            title={() => (
                <Row justify='space-between'>
                    <Col>
                        <Title level={5} style={{ margin: 0 }}>{table.table_name}</Title>
                    </Col>
                    <Col>
                        <Text>{`${Object.keys(table.data[0]).length} Columns | ${table.data.length} Rows`}</Text>
                    </Col>
                </Row>
            )}
            pagination={false}
            bordered
            scroll={{ x: 'max-content', y: 500 }}
        />
    );
}