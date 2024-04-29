import { Row, Col, Space, Typography, Button, Tag } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import AggregateTag from './aggregate-tag';

const { Text } = Typography;

export default function DroppableAxis({ axis, item, setItem, chartType }) {
    const { isOver, setNodeRef } = useDroppable({ id: axis });

    const style_valid = { 
        backgroundColor: isOver && !item ? '#0000000A' : undefined, 
        width: '100%', 
        padding: '0 10px',
        border: '1px solid #D9D9D9',
        borderRadius: '0 8px 8px 0'
    };

    const style_invalid = {
        backgroundColor: '#0000001A',
        width: '100%', 
        padding: '0 10px',
        border: '1px solid #D9D9D9',
        borderRadius: '0 8px 8px 0'
    };

    const handleCloseItem = () => {
        setItem(null);
    };

    const handleChangeAggregate = (value) => {
        setItem({ ...item, aggregate_func: value });
    };
    
    return (
        <Space.Compact style={{ width: '100%' }}>
            <Button style={{ width: '120px', backgroundColor: '#00000005', pointerEvents: 'none' }}>{`${axis}-Axis`}</Button>
            { ((chartType === 'area' || chartType === 'bar' || chartType === 'radar') && axis === 'Size') || (chartType === 'pie' && (axis === 'Color' || axis === 'Size')) ? <Row style={style_invalid} /> :
                <Row justify='space-between' align='middle' ref={setNodeRef} style={style_valid}>
                    <Col>
                        { item ? <AggregateTag tag={item} axis={axis} handleCloseTag={handleCloseItem} handleChangeAggregate={handleChangeAggregate} /> : undefined }
                    </Col>
                    <Col>
                        <Text type='secondary' style={{ fontWeight: 'normal' }}>
                            { item ? 1 : 0 } / 1
                        </Text>
                    </Col>
                </Row>
            }
        </Space.Compact>
    );
};