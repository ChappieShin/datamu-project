import Link from 'next/link';
import { Row, Col, Typography, Badge } from 'antd';
import abbreviate from 'number-abbreviate';
import StringAvatar from '../etc/avatar-string';

const { Text, Paragraph } = Typography;

export default function DatasetCard({ dataset, type }) {
    return (
        <Link href={`/explore-dataset/${dataset.dataset_id}`}>
            <Row justify='space-between'>
                <Paragraph>{dataset.title}</Paragraph>
                <Badge 
                    count={type === 'view' ? (abbreviate(dataset.view_count, 1) + ' views') : (abbreviate(dataset.export_count, 1) + ' times')} 
                    color={type === 'view' ? 'volcano' : 'cyan'}
                />
            </Row>
            <Paragraph type='secondary' ellipsis={{ rows: 2 }}>{dataset.subtitle}</Paragraph>
            <Row gutter={5} align='middle'>
                <Col>
                    <StringAvatar fname={dataset.fname} lname={dataset.lname} />
                </Col>
                <Col>
                    <Text type='secondary' style={{ fontSize: '12px' }}>{dataset.fname + ' ' + dataset.lname}</Text>
                </Col>
            </Row>
        </Link>
    );
}