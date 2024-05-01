'use client'

import { useState } from 'react';
import { Layout, Space, Typography, Card, Collapse, Empty } from 'antd';
import { DndContext } from '@dnd-kit/core';

import ToolBar from './tool-bar';
import DraggableTag from './draggable-tag';
import Chart from './chart';

const { Content } = Layout;
const { Title } = Typography;

export default function PageContent({ dataset }) {
    const [chartType, setChartType] = useState('line');
    const [activeTable, setActiveTable] = useState(dataset.tables[0].table_id);
    const [axisXItem, setAxisXItem] = useState(null);
    const [axisYItem, setAxisYItem] = useState(null);
    const [axisColorItem, setAxisColorItem] = useState(null);
    const [axisSizeItem, setAxisSizeItem] = useState(null);
    const [orderValue, setOrderValue] = useState('def');
    const [optionValue, setOptionValue] = useState('stack');

    const collapse_items = dataset.tables.map((table) => (
        { 
            label: table.table_name,
            key: table.table_id,
            children: (
                <div style={{ maxHeight: '400px', }}>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        {Object.keys(table.data[0]).map((col, index) => (
                            <DraggableTag key={index} table={table} col={col} />
                        ))}
                    </Space>
                </div>
            )
        }
    )); // style = {{ overflowY: 'auto' }}

    const handleChartChange = (type) => {
        setChartType(type);
        // if (type === 'pie' && axisYItems.length > 0) {
        //     setAxisYItems([axisYItems[0]])
        // }
    };

    const handleTableChange = (table_ids) => {
        if (table_ids.length > 0) {
            setActiveTable(table_ids[0]);
            setAxisXItem(null);
            setAxisYItem(null);
            setAxisColorItem(null);
            setAxisSizeItem(null);
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && over.id === 'X' && !axisXItem) {
            setAxisXItem(active.data.current);
        }
        if (over && over.id === 'Y' && !axisYItem) {
            setAxisYItem(active.data.current);
        }
        if (over && over.id === 'Color' && !axisColorItem) {
            setAxisColorItem(active.data.current);
        }
        if (over && over.id === 'Size' && !axisSizeItem) {
            setAxisSizeItem(active.data.current);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Content style={{ padding: '24px' }}>
                <Card 
                    title={
                        <ToolBar
                            chartType={chartType}
                            handleChartChange={handleChartChange}
                            xItem={axisXItem} 
                            setXItem={setAxisXItem} 
                            yItem={axisYItem} 
                            setYItem={setAxisYItem}
                            colorItem={axisColorItem}
                            setColorItem={setAxisColorItem}
                            sizeItem={axisSizeItem}
                            setSizeItem={setAxisSizeItem}
                            order={orderValue}
                            setOrder={setOrderValue}
                            option={optionValue}
                            setOption={setOptionValue}
                        />
                    }
                >
                    <Card.Grid hoverable={false} style={{ width: '25%' }}>
                        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                            <Title level={4} style={{ margin: 0 }}>Attributes</Title>
                            <Collapse 
                                accordion
                                size='small'
                                items={collapse_items}
                                activeKey={activeTable}
                                onChange={handleTableChange}
                            />
                        </Space>
                    </Card.Grid>
                    <Card.Grid hoverable={false} style={{ width: '75%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        { !axisXItem || !axisYItem ? <Empty /> :
                            <Chart 
                                type={chartType}
                                data={dataset.tables.find((table) => (table.table_id == activeTable)).data} 
                                xAxis={axisXItem}
                                yAxis={axisYItem}
                                colorAxis={axisColorItem}
                                sizeAxis={axisSizeItem}
                                order={orderValue}
                                option={optionValue}
                            />
                        }
                    </Card.Grid>
                </Card>
            </Content>
        </DndContext>
    );
}