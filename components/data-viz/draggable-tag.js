import { Tag, Tooltip } from 'antd';
import { FieldNumberOutlined, FieldStringOutlined, FieldBinaryOutlined, FieldTimeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDraggable } from '@dnd-kit/core';
import check from 'check-types';

export default function DraggableTag({ table, col }) {
    const data_type = check.number(table.data[0][col]) ? 'number' :
                      check.boolean(table.data[0][col]) ? 'boolean' :
                      check.date(new Date(table.data[0][col])) ? 'datetime' :
                      check.string(table.data[0][col]) ? 'string' :
                      undefined;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({ 
        id: `${table.table_id}_${col}`,
        data: {
            table_name: table.table_name,
            col_name: col,
            data_type: data_type,
            aggregate_func: 'none'
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'unset',
        cursor: 'grabbing'
    } : { cursor: 'grab' };

    return (
        <Tooltip 
            title={
                data_type === 'number' ? (<>{`${table.table_name}:`}<br />{`${col} (Number)`}</>) :
                data_type === 'boolean' ? (<>{`${table.table_name}:`}<br />{`${col} (Boolean)`}</>) :
                data_type === 'datetime' ? (<>{`${table.table_name}:`}<br />{`${col} (Datetime)`}</>) :
                data_type === 'string' ? (<>{`${table.table_name}:`}<br />{`${col} (String)`}</>) :
                (<>{`${table.table_name}:`}<br />{`${col} (Unknown)`}</>)
            }
            placement='right'
        >
            <Tag 
                icon={
                    data_type === 'number' ? <FieldNumberOutlined /> :
                    data_type === 'boolean' ? <FieldBinaryOutlined /> :
                    data_type === 'datetime' ? <FieldTimeOutlined /> :
                    data_type === 'string' ? <FieldStringOutlined /> :
                    <QuestionCircleOutlined />
                }
                color={
                    data_type === 'number' ? 'processing' :
                    data_type === 'boolean' ? 'error' :
                    data_type === 'datetime' ? 'success' :
                    data_type === 'string' ? 'warning' :
                    undefined
                }
                bordered={false}
                ref={setNodeRef}
                style={style} 
                {...attributes}
                {...listeners}
            >
                {col}
            </Tag>
        </Tooltip>
    );
};