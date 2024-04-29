import { Row, Col, Space, Typography, Button, Tooltip, Select } from 'antd';
import { LineChartOutlined, AreaChartOutlined, BarChartOutlined, PieChartOutlined, DotChartOutlined, RadarChartOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import DroppableAxis from './droppable-axis';

const { Title } = Typography;

export default function ToolBar({ chartType, handleChartChange, xItem, setXItem, yItem, setYItem, colorItem, setColorItem, sizeItem, setSizeItem, order, setOrder, option, setOption }) {

    const handleClearAllItems = () => {
        setXItem(null);
        setYItem(null);
        setColorItem(null);
        setSizeItem(null);
    };

    return (
        <Space direction='vertical' size='middle' style={{ width: '100%', padding: '20px 0' }}>
            <Row justify='space-between'>
                <Col>
                    <Space>
                        <Title level={5} style={{ margin: 0 }}>Charts:</Title>
                        <Tooltip title='Line Chart'>
                            <Button 
                                shape='circle' 
                                icon={<LineChartOutlined />} 
                                type={chartType === 'line' ? 'primary' : undefined} 
                                onClick={() => handleChartChange('line')} 
                            />
                        </Tooltip>
                        <Tooltip title='Area Chart'>
                            <Button 
                                shape='circle' 
                                icon={<AreaChartOutlined />} 
                                type={chartType === 'area' ? 'primary' : undefined} 
                                onClick={() => handleChartChange('area')} 
                            />
                        </Tooltip>
                        <Tooltip title='Bar Chart'>
                            <Button 
                                shape='circle' 
                                icon={<BarChartOutlined />} 
                                type={chartType === 'bar' ? 'primary' : undefined} 
                                onClick={() => handleChartChange('bar')} 
                            />
                        </Tooltip>
                        <Tooltip title='Pie Chart'>
                            <Button 
                                shape='circle' 
                                icon={<PieChartOutlined />} 
                                type={chartType === 'pie' ? 'primary' : undefined} 
                                onClick={() => handleChartChange('pie')} 
                            />
                        </Tooltip>
                        <Tooltip title='Scatter Chart'>
                            <Button 
                                shape='circle' 
                                icon={<DotChartOutlined />} 
                                type={chartType === 'scatter' ? 'primary' : undefined} 
                                onClick={() => handleChartChange('scatter')} 
                            />
                        </Tooltip>
                        <Tooltip title='Radar Chart'>
                            <Button 
                                shape='circle'
                                icon={<RadarChartOutlined />} 
                                type={chartType === 'radar' ? 'primary' : undefined} 
                                onClick={() => handleChartChange('radar')} 
                            />
                        </Tooltip>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        Order by:
                        <Select 
                            options={[
                                { label: 'Default', value: 'def' },
                                { label: 'Ascending', value: 'asc' },
                                { label: 'Descending', value: 'desc' }
                            ]}
                            value={order}
                            onChange={(value) => (setOrder(value))}
                            style={{ width: 120 }}
                        />
                        Type:
                        <Select 
                            options={[
                                { label: 'Stacked', value: 'stack' },
                                { label: 'Grouped', value: 'group' }
                            ]}
                            value={option}
                            onChange={(value) => (setOption(value))}
                            disabled={chartType !== 'bar'}
                            style={{ width: 120 }}
                        />
                    </Space>
                </Col>
            </Row>
            <Row justify='space-between'>
                <Space direction='vertical' style={{ width: '44%' }}>
                    <DroppableAxis axis='X' item={xItem} setItem={setXItem} chartType={chartType} />
                    <DroppableAxis axis='Y' item={yItem} setItem={setYItem} chartType={chartType} />
                </Space>
                <Space direction='vertical' style={{ width: '44%' }}>
                    <DroppableAxis axis='Color' item={colorItem} setItem={setColorItem} chartType={chartType} />
                    <DroppableAxis axis='Size' item={sizeItem} setItem={setSizeItem} chartType={chartType} />
                </Space>
                <Space direction='vertical' style={{ width: '10%' }}>
                    <Button block type='primary' icon={<FilterOutlined />} disabled>Filter</Button>
                    <Button block type='primary' danger icon={<CloseOutlined />} onClick={() => (handleClearAllItems())}>Clear All</Button>
                </Space>
            </Row>
        </Space>
    );
}