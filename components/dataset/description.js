import { Row, Col, Space, Typography, Card, Tag, Tooltip, Badge } from 'antd';
import StringAvatar from '../etc/avatar-string';
import StringTag from '../etc/tag-string';
import ActivityOverview from './activity-overview';
import { filesize } from 'filesize';

const { Text, Paragraph } = Typography;

export default function Description({ dataset }) {
    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Card title='About Dataset'>
                <Card.Grid hoverable={false} style={{ width: '75%' }}>
                    <Paragraph>
                        {dataset.description}
                    </Paragraph>
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: '25%' }}>
                    <Space direction='vertical' size='middle'>
                        <Space direction='vertical'>
                            <Text strong>Owner:</Text>
                            <Row gutter={5} align='middle'>
                                <Col>
                                    <StringAvatar fname={dataset.fname} lname={dataset.lname} />
                                </Col>
                                <Col>
                                    <Text type='secondary'>{dataset.fname + ' ' + dataset.lname}</Text>
                                </Col>
                            </Row>
                        </Space>
                        <Space direction='vertical'>
                            <Text strong>Last modified:</Text>
                            <Text type='secondary'>{new Date(dataset.modified_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                        </Space>
                        <Space direction='vertical'>
                            <Text strong>Number of tables:</Text>
                            <Text type='secondary'>{`${dataset.num_tables} tables (${filesize(dataset.total_size)})`}</Text>
                        </Space>
                        <Space direction='vertical'>
                            <Text strong>Organization:</Text>
                            <Tooltip title={dataset.faculty_name}>
                                <Tag color={dataset.faculty_color}>{dataset.faculty_short}</Tag>
                            </Tooltip>
                        </Space>
                        <Space direction='vertical'>
                            <Text strong>Tags:</Text>
                            {dataset.tags && dataset.tags.split(',').map((tag) => (<StringTag name={tag} />))}
                        </Space>
                    </Space>
                </Card.Grid>
            </Card>
            <ActivityOverview dataset_id={dataset.dataset_id} />
        </Space>
    );
}