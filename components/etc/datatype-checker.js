import { Space, Typography } from 'antd';
import { FieldNumberOutlined, FieldStringOutlined, FieldBinaryOutlined, FieldTimeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import check from 'check-types';

const { Text } = Typography;

export default function DatatypeChecker({ col_name, col_data }) {
    return (
        <Space direction='vertical'>
            {col_name}
            <Space>
                {
                    check.number(col_data) ? <FieldNumberOutlined style={{ color: '#00000073' }} /> :
                    check.boolean(col_data) ? <FieldBinaryOutlined style={{ color: '#00000073' }} /> :
                    check.date(new Date(col_data)) ? <FieldTimeOutlined style={{ color: '#00000073' }} /> :
                    check.string(col_data) ? <FieldStringOutlined style={{ color: '#00000073' }} /> :
                    <QuestionCircleOutlined style={{ color: '#00000073' }} />
                }
                <Text type='secondary' style={{ fontSize: '12px', fontWeight: 'normal' }}>
                    { 
                        check.number(col_data) ? 'Number' :
                        check.boolean(col_data) ? 'Boolean' :
                        check.date(new Date(col_data)) ? 'Datetime' : 
                        check.string(col_data) ? 'String' :
                        'Unknown'
                    }
                </Text>
            </Space>
        </Space>
    );
}