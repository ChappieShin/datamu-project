import Link from 'next/link';
import { Row, Col, Space, Typography, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

export default function TableHeader() {
    return (
        <Row justify='space-between'>
            <Col>
                <Title level={3} style={{ margin: 0 }}>Tag List</Title>
            </Col>
            <Col>
                <Space size='middle'>
                    <Search
                        placeholder='Search tags...'
                        allowClear
                        onSearch={() => {console.log('search')}}
                    />
                    <Link href='/tag-management/create'>
                        <Button type='primary' icon={<PlusOutlined />}>Add Tag</Button>
                    </Link>
                </Space>
            </Col>
        </Row>
    );
}