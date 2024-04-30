import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

import { Row, Col, Space, Typography, Button, Tooltip, Modal, Form, Select, Input, Dropdown, Switch, message } from 'antd';
import { InsertRowBelowOutlined, InsertRowRightOutlined, MergeCellsOutlined, FileSearchOutlined, DownloadOutlined, SaveOutlined, FileTextOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ToolBar({ dataset, setDataset, dataset_id, owner_id, table_id, set_table_id, fetchDataset, existing_dataset }) {
    const { data: session, status } = useSession();
    const [modalAppend, setModalAppend] = useState(false);
    const [modalJoin, setModalJoin] = useState(false);
    const [modalCluster, setModalCluster] = useState(false);
    const [modalSaveTable, setModalSaveTable] = useState(false);
    const [modalReplaceTable, setModalReplaceTable] = useState(false);

    const [joinTable1, setJoinTable1] = useState([]);
    const [joinTable2, setJoinTable2] = useState([]);
    const [clusterTable, setClusterTable] = useState([]);
    const [numResultTable, setNumResultTable] = useState(1);

    const [formAppend] = Form.useForm();
    const [formJoin] = Form.useForm();
    const [formCluster] = Form.useForm();
    const [formSaveTable] = Form.useForm();
    const [formReplaceTable] = Form.useForm();

    const handleAppendCancel = () => {
        formAppend.resetFields();
        setModalAppend(false);
    };

    const handleJoinCancel = () => {
        formJoin.resetFields();
        setModalJoin(false);
    };

    const handleClusterCancel = () => {
        formCluster.resetFields();
        setModalCluster(false);
    };

    const handleSaveTableCancel = () => {
        formSaveTable.resetFields();
        setModalSaveTable(false);
    };

    const handleReplaceTableCancel = () => {
        formReplaceTable.resetFields();
        setModalReplaceTable(false);
    };

    const handleAppendFinish = async (values) => {
        const body = {
            ...values,
            table_1: dataset.find((table) => (table.table_id === values.table_1)).data,
            table_2: dataset.find((table) => (table.table_id === values.table_2)).data,
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/append-table`, body);
            const data = response.data;
            const id = uuidv4();
            setDataset([...dataset, { table_id: id, table_name: `Result Table (${numResultTable})`, data: data }]);
            set_table_id(id);
            setNumResultTable(numResultTable + 1);
            formAppend.resetFields();
            setModalAppend(false);
        } catch (error) {
            console.log('Error', error);
            message.error(error.response.data.detail);
        }
    };

    const handleJoinFinish = async (values) => {
        const body = {
            ...values,
            table_1: dataset.find((table) => (table.table_id === values.table_1)).data,
            table_2: dataset.find((table) => (table.table_id === values.table_2)).data,
        };
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/join-table`, body);
            const data = response.data;
            const id = uuidv4();
            setDataset([...dataset, { table_id: id, table_name: `Result Table (${numResultTable})`, data: data }]);
            set_table_id(id);
            setNumResultTable(numResultTable + 1);
            formJoin.resetFields();
            setModalJoin(false);
        } catch (error) {
            console.log('Error', error);
            message.error(error.response.data.detail);
        }
    };

    const handleClusterFinish = async (values) => {
        const body = {
            ...values,
            table: dataset.find((table) => (table.table_id === values.table)).data
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/cluster-matching`, body);
            const data = response.data;
            const id = uuidv4();
            setDataset([...dataset, { table_id: id, table_name: `Result Table (${numResultTable})`, data: data }]);
            set_table_id(id);
            setNumResultTable(numResultTable + 1);
            formCluster.resetFields();
            setModalCluster(false);
        } catch (error) {
            console.log('Error', error);
            message.error(error.response.data.detail);
        }
    };

    const handleSaveTableFinish = async (values) => {
        const body = {
            ...values,
            dataset_id: dataset_id,
            data: dataset.find((table) => (table.table_id === table_id)).data,
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tables`, body);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                formSaveTable.resetFields();
                setModalSaveTable(false);
                fetchDataset();
            }
            else {
                message.error(`Failed to save a new table (Detail: ${data.message})`);
            }
        } catch (error) {
            message.error(`Failed to save a new table (Detail: ${error})`);
        }
    };

    const handleReplaceTableFinish = async (values) => {
        const body = {
            data: dataset.find((table) => (table.table_id === table_id)).data
        };

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/${values.table_id}`, body);
            const data = response.data;
            if (!data.error) {
                message.success(data.message);
                formReplaceTable.resetFields();
                setModalReplaceTable(false);
                fetchDataset();
            }
            else {
                message.error(`Failed to replace an existing table (Detail: ${data.message})`);
            }
        } catch (error) {
            message.error(`Failed to replace an existing table (Detail: ${error})`);
        }
    };

    const handleExportCSV = async (table_id) => {
        try {
            const table = dataset.find((table) => (table.table_id === table_id))
            const worksheet = XLSX.utils.json_to_sheet(table.data);
            const csv_data = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv_data], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${table.table_name}.csv`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.log('Error', error);
            message.error(error.message);
        }
    };

    const handleExportExcel = async (table_id) => {
        try {
            const workbook = XLSX.utils.book_new();
            const table = dataset.find((table) => (table.table_id === table_id))
            const worksheet = XLSX.utils.json_to_sheet(table.data);
            XLSX.utils.book_append_sheet(workbook, worksheet, table.table_name);
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${table.table_name}.xlsx`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.log('Error', error);
            message.error(error.message);
        }
    };
    
    const handleJoinTable1Change = (value) => {
        const columns = Object.keys(dataset.find((table) => (table.table_id === value)).data[0]);
        const select_items = columns.map((col) => ({ label: col, value: col }));
        setJoinTable1(select_items);
        formJoin.resetFields(['join_col_1']);
    };

    const handleJoinTable2Change = (value) => {
        const columns = Object.keys(dataset.find((table) => (table.table_id === value)).data[0]);
        const select_items = columns.map((col) => ({ label: col, value: col }));
        setJoinTable2(select_items);
        formJoin.resetFields(['join_col_2']);
    };

    const handleClusterTableChange = (value) => {
        const columns = Object.keys(dataset.find((table) => (table.table_id === value)).data[0]);
        const select_items = columns.map((col) => ({ label: col, value: col }));
        setClusterTable(select_items);
        formCluster.resetFields(['col']);
    };

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    return (
        <>
            <Row justify='space-between'>
                <Col>
                    <Space>
                        <Title level={5} style={{ margin: 0 }}>Tools:</Title>
                        <Tooltip title='Append Table'>
                            <Button 
                                shape='circle'
                                type='primary'
                                icon={<InsertRowBelowOutlined />}
                                onClick={() => (setModalAppend(true))}
                            />
                        </Tooltip>
                        <Tooltip title='Join Table'>
                            <Button 
                                shape='circle' 
                                type='primary' 
                                icon={<MergeCellsOutlined />}
                                onClick={() => (setModalJoin(true))}
                            />
                        </Tooltip>
                        <Tooltip title='Cluster Matching'>
                            <Button 
                                shape='circle' 
                                type='primary' 
                                icon={<FileSearchOutlined />} 
                                onClick={() => (setModalCluster(true))}
                            />
                        </Tooltip>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Dropdown
                            menu={{
                                items: [
                                    { 
                                        key: 'csv', 
                                        label: 'Export as CSV (.csv)',
                                        icon: <FileTextOutlined />,
                                        onClick: () => (handleExportCSV(table_id))
                                    },
                                    { 
                                        key: 'xlsx', 
                                        label: 'Export as Excel (.xlsx)',
                                        icon: <FileExcelOutlined />,
                                        onClick: () => (handleExportExcel(table_id))
                                    }
                                ]
                            }}
                            placement='bottom'
                            arrow={{ pointAtCenter: true }}
                        >
                            <Button icon={<DownloadOutlined />}>Export</Button>
                        </Dropdown>
                        <Dropdown
                            menu={{
                                items: [
                                    { 
                                        key: 'save', 
                                        label: 'Save as new table',
                                        onClick: () => (setModalSaveTable(true))
                                    },
                                    { 
                                        key: 'replace', 
                                        label: 'Replace on existing table',
                                        onClick: () => (setModalReplaceTable(true))
                                    }
                                ]
                            }}
                            placement='bottom'
                            arrow={{ pointAtCenter: true }}
                            disabled={owner_id !== session.user.name}
                        >
                            <Button type='primary' icon={<SaveOutlined />}>Save</Button>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
            <Modal
                title='Append Table'
                open={modalAppend}
                onCancel={handleAppendCancel}
                footer={[]}
            >
                <Form form={formAppend} onFinish={handleAppendFinish} style={{ paddingTop: '15px' }}>
                    <Form.Item
                        label='Table 1'
                        name='table_1'
                        rules={[{required: true, message: 'Please select a table'}]}
                    >
                        <Select
                            placeholder='Select table 1'
                            options={dataset.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Table 2'
                        name='table_2'
                        rules={[{required: true, message: 'Please select a table'}]}
                    >
                        <Select
                            placeholder='Select table 2'
                            options={dataset.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Append Type'
                        name='append_type'
                        rules={[{required: true, message: 'Please select append type'}]}
                    >
                        <Select
                            placeholder='Select append type'
                            options={[
                                { label: <Space><InsertRowBelowOutlined />Vertical</Space>, value: 'vertical' },
                                { label: <Space><InsertRowRightOutlined />Horizontal</Space>, value: 'horizontal' }
                            ]}
                            style={{ width: '50%' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleAppendCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Append</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title='Join Table'
                open={modalJoin}
                onCancel={handleJoinCancel}
                footer={[]}
            >
                <Form form={formJoin} onFinish={handleJoinFinish} style={{ paddingTop: '15px' }}>
                    <Form.Item
                        label='Table 1'
                        name='table_1'
                        rules={[{required: true, message: 'Please select a table'}]}
                    >
                        <Select
                            placeholder='Select table 1'
                            onChange={handleJoinTable1Change}
                            options={dataset.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Join On'
                        name='join_col_1'
                        rules={[{required: true, message: 'Please select join column of table 1'}]}
                    >
                        <Select
                            placeholder='Select join column of table 1'
                            options={joinTable1}
                            disabled={joinTable1.length === 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Table 2'
                        name='table_2'
                        rules={[{required: true, message: 'Please select a table'}]}
                    >
                        <Select
                            placeholder='Select table 2'
                            onChange={handleJoinTable2Change}
                            options={dataset.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Join On'
                        name='join_col_2'
                        rules={[{required: true, message: 'Please select join column of table 2'}]}
                    >
                        <Select
                            placeholder='Select join column of table 2'
                            options={joinTable2}
                            disabled={joinTable2.length === 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<Text>Joined Column Name <Text type='secondary'>(optional)</Text></Text>}
                        name='join_col_name'
                    >
                        <Input placeholder='Enter a new column name of joined column' />
                    </Form.Item>
                    <Form.Item
                        label='Join Type'
                        name='join_type'
                        rules={[{required: true, message: 'Please select join type'}]}
                    >
                        <Select
                            placeholder='Select join type'
                            options={[
                                { label: 'Inner Join', value: 'inner' },
                                { label: 'Left Join', value: 'left' },
                                { label: 'Right Join', value: 'right' },
                                { label: 'Outer Join', value: 'outer' },
                            ]}
                            style={{ width: '50%' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleJoinCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Join</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title='Cluster Matching'
                open={modalCluster}
                onCancel={handleClusterCancel}
                footer={[]}
            >
                <Form form={formCluster} onFinish={handleClusterFinish} style={{ paddingTop: '15px' }}>
                    <Form.Item
                        label='Table'
                        name='table'
                        rules={[{required: true, message: 'Please select a table'}]}
                    >
                        <Select
                            placeholder='Select a table'
                            onChange={handleClusterTableChange}
                            options={dataset.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Column'
                        name='col'
                        rules={[{required: true, message: 'Please select a column'}]}
                    >
                        <Select
                            placeholder='Select a column you want to match'
                            options={clusterTable}
                            disabled={clusterTable.length === 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<Text>Clustered Column Name <Text type='secondary'>(optional)</Text></Text>}
                        name='cluster_col_name'
                    >
                        <Input placeholder='Enter a new column name of clustered column' />
                    </Form.Item>
                    <Form.Item
                        label='Replace Column'
                        name='replace_col'
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleClusterCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Match</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title='Save As New Table'
                open={modalSaveTable}
                onCancel={handleSaveTableCancel}
                footer={[]}
            >
                <Form form={formSaveTable} onFinish={handleSaveTableFinish} style={{ paddingTop: '15px' }}>
                    <Form.Item
                        label='Table Name'
                        name='table_name'
                        rules={[{required: true, message: 'Please enter a table name'}]}
                        initialValue={dataset.find((table) => (table.table_id === table_id)).table_name}
                    >
                        <Input placeholder='Enter a table name' />
                    </Form.Item>
                    <Form.Item
                        label={<Text>Description <Text type='secondary'>(optional)</Text></Text>}
                        name='description'
                    >
                        <Input placeholder='Enter a table description' />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleSaveTableCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Save</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title='Replace On Existing Table'
                open={modalReplaceTable}
                onCancel={handleReplaceTableCancel}
                footer={[]}
            >
                <Form form={formReplaceTable} onFinish={handleReplaceTableFinish} style={{ paddingTop: '15px' }}>
                    <Form.Item
                        label='Table'
                        name='table_id'
                        rules={[{required: true, message: 'Please select an existing table'}]}
                    >
                        <Select
                            placeholder='Select an existing table'
                            onChange={handleClusterTableChange}
                            options={existing_dataset.map((table) => ({ label: table.table_name, value: table.table_id }))}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleReplaceTableCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Replace</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}