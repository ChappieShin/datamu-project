'use client'

import { useState } from 'react';
import { Layout, Row, Space, Steps } from 'antd';
import EnterForm from './step-form';
import ImportData from './step-import';
import DonePage from './step-done';

const { Content } = Layout;

export default function PageContent() {
    const [currentStep, setCurrentStep] = useState(0);
    const [datasetForm, setDatasetForm] = useState({});

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const step_items = [
        {
            title: 'Enter dataset info',
            key: '1',
            content: <EnterForm handleForm={setDatasetForm} nextStep={handleNextStep} />
        },
        {
            title: 'Import data',
            key: '2',
            content: <ImportData datasetForm={datasetForm} handleForm={setDatasetForm} nextStep={handleNextStep} prevStep={handlePrevStep} />
        },
        {
            title: 'Done',
            key: '3',
            content: <DonePage datasetForm={datasetForm} />
        }
    ];

    return (
        <Content style={{ padding: '24px' }}>
            <Space direction='vertical' size={40} style={{ display: 'flex' }}>
                <Row justify='center'>
                    <Steps current={currentStep} items={step_items} style={{ width: '700px' }} />
                </Row>
                <Row justify='center'>
                    {step_items[currentStep].content}
                </Row>
            </Space>
        </Content>
    );
}