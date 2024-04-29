import Link from 'next/link';
import axios from 'axios';
import { Row, Col, Space, Typography, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

export default function TableHeader({ setDatasetList }) {

    const handleSearchDataset = async (keyword) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/datasets?search_keyword=${keyword}`);
            const data = response.data;
            if (!data.error) {
                setDatasetList(data.data);
            }
            else {
                message.error(data.message);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    return (
        <Row justify='space-between'>
            <Col>
                <Title level={3} style={{ margin: 0 }}>Dataset List</Title>
            </Col>
            <Col>
                <Space size='middle'>
                    <Search
                        placeholder='Search datasets...'
                        allowClear
                        onSearch={(value) => (handleSearchDataset(value))}
                    />
                    <Link href='/my-dataset/create'>
                        <Button type='primary' icon={<PlusOutlined />}>Create Dataset</Button>
                    </Link>
                </Space>
            </Col>
        </Row>
    );
}