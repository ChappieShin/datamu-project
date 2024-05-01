import Link from 'next/link';
import { Row, Col, Space, Typography } from 'antd';
import { EyeOutlined, DownloadOutlined, CalendarOutlined } from '@ant-design/icons';
import abbreviate from 'number-abbreviate';
import StringAvatar from '../etc/avatar-string';

const { Text, Paragraph } = Typography;

export default function DatasetCard({ dataset, type }) {
    return (
        <Link href={`/explore-dataset/${dataset.dataset_id}`}>
            <Paragraph ellipsis={{ rows: 1 }}>{dataset.title}</Paragraph>
            <Paragraph 
                type='secondary' 
                ellipsis={{ rows: 2 }} 
                style={{ marginBottom: dataset.subtitle && dataset.subtitle.length < 40 ? '36px' : '14px' }}
            >
                {dataset.subtitle}
            </Paragraph>
            <Row gutter={5} align='middle'>
                <Col>
                    <StringAvatar fname={dataset.fname} lname={dataset.lname} />
                </Col>
                <Col>
                    <Text type='secondary' style={{ fontSize: '12px' }}>{dataset.fname + ' ' + dataset.lname}</Text>
                </Col>
            </Row>
            <Row justify='space-between' align='middle' style={{ marginTop: '20px' }}>
                <Col>
                    <Space>
                        <CalendarOutlined style={{ color: '#00000073' }} />
                        <Text type='secondary' style={{ fontSize: '12px' }}>        
                            {new Date(dataset.modified_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        {type === 'view' ? <EyeOutlined style={{ color: '#00000073' }} /> : <DownloadOutlined style={{ color: '#00000073' }} />}
                        <Text type='secondary' style={{ fontSize: '12px' }}>
                            {type === 'view' ? `${abbreviate(dataset.view_count, 1)} views` : `${abbreviate(dataset.export_count, 1)} times`}
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Link>
    );
}