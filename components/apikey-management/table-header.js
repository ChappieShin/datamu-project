import Link from 'next/link';
import { Row, Col, Space, Typography, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

export default function TableHeader() {
    return (
        <Row justify='space-between'>
            <Col>
                <Title level={3} style={{ margin: 0 }}>API Key List</Title>
            </Col>
            <Col>
                <Space size='middle'>
                    <Search
                        placeholder='Search API Keys...'
                        allowClear
                        onSearch={() => {console.log('search')}}
                    />
                    <Link href='/apikey-management/create'>
                        <Button type='primary' icon={<PlusOutlined />}>Generate API Key</Button>
                    </Link>
                </Space>
            </Col>
        </Row>
    );
}