import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Row, Col, Typography, Card, Input } from 'antd';

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function SearchCard() {
    const router = useRouter();

    const handleSearch = (value) => {
        router.push(`/explore-dataset?search_keyword=${encodeURIComponent(value)}`);
    };

    return (
        <Card 
            style={{ 
                backgroundImage: 'url("/background.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '60px'
            }}
        >
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row justify='center' align='middle'>
                        <Image src='/logo.png' alt='logo' width={64} height={64} />
                        <Title
                            style={{
                                margin: '8px',
                                background: 'linear-gradient(to bottom, #2890E7, #4036CF)',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            Data.mu
                        </Title>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row justify='center'>
                        <Paragraph>Data.mu: Web-Based Data Platform for Mahidol University</Paragraph>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row justify='center'>
                        <Search 
                            placeholder='Search datasets...'
                            allowClear
                            enterButton
                            size='large'
                            onSearch={handleSearch}
                            style={{ width: '600px' }}
                        />
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}