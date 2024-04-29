import { useState } from 'react';
import { Space, Tag, Tooltip, Dropdown } from 'antd';
import { FieldNumberOutlined, FieldStringOutlined, FieldBinaryOutlined, FieldTimeOutlined, QuestionCircleOutlined, CaretDownOutlined } from '@ant-design/icons';

export default function AggregateTag({ tag, axis, handleCloseTag, handleChangeAggregate }) {
    const { table_name, col_name, data_type, aggregate_func } = tag;
    const [aggregateValue, setAggregateValue] = useState(aggregate_func);
    const aggregate_options = data_type === 'number' ? [
        { label: 'NONE', key: 'none' },
        { label: 'MIN', key: 'min' },
        { label: 'MAX', key: 'max' },
        { label: 'SUM', key: 'sum' },
        { label: 'AVG', key: 'avg' },
        { label: 'COUNT', key: 'count' }
    ] : data_type === 'datetime' ?
    [
        { label: 'NONE', key: 'none' },
        { label: 'YEAR', key: 'year' },
        { label: 'MONTH', key: 'month' },
        { label: 'DAY', key: 'day' }
    ] :
    [
        { label: 'NONE', key: 'none' },
        { label: 'COUNT', key: 'count' },
        { label: 'COUNT DISTINCT', key: 'count_dist' }
    ];

    const handleSelectAggregate = (value) => {
        setAggregateValue(value);
        handleChangeAggregate(value);
    };

    return (
        <Tooltip 
            title={
                data_type === 'number' ? (<>{`${table_name}:`}<br />{`${col_name} (Number)`}</>) :
                data_type === 'boolean' ? (<>{`${table_name}:`}<br />{`${col_name} (Boolean)`}</>) :
                data_type === 'datetime' ? (<>{`${table_name}:`}<br />{`${col_name} (Datetime)`}</>) :
                data_type === 'string' ? (<>{`${table_name}:`}<br />{`${col_name} (String)`}</>) :
                (<>{`${table_name}:`}<br />{`${col_name} (Unknown)`}</>)
            }
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
                closable
                onClose={() => (handleCloseTag())}
            >
                <Space size={5}>
                    { aggregateValue === 'none' ? col_name : `${aggregateValue.toUpperCase()}(${col_name})` }
                    { axis === 'Color' || axis === 'Size' ? undefined :
                        <Dropdown
                            menu={{
                                items: [{
                                    label: 'Aggregate Function',
                                    key: 'agg',
                                    type: 'group',
                                    children: aggregate_options
                                }],
                                selectable: true,
                                selectedKeys: [aggregateValue],
                                onClick: ({ key }) => (handleSelectAggregate(key))
                            }}
                            trigger={['click']}
                            placement='bottom'
                            arrow={{ pointAtCenter: true }}
                        >
                            <CaretDownOutlined style={{ cursor: 'pointer' }} />
                        </Dropdown>
                    }   
                </Space>
            </Tag>
        </Tooltip>
    );
}