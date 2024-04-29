'use client'

import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Paragraph } = Typography;

export default function PageFooter() {
    return (
        <Footer style={{ textAlign: 'center' }}>
            <Paragraph>Data.mu ©2024 Faculty of ICT, Mahidol University</Paragraph>
        </Footer>
    );
}