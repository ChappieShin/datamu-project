'use client'

import Link from 'next/link';
import { Result, Button } from 'antd';

export default function Error({ error, reset }) {
    return (
        <Result 
            status='500'
            title='500 - Error'
            subTitle={
                <>
                    Sorry, something went wrong.
                    <br />
                    Detail: {error.message}
                </>
            }
            extra={[
                <Button onClick={() => reset()}>Try Again</Button>,
                <Link href='/'>
                    <Button type='primary'>Back Home</Button>
                </Link>
            ]}
            style={{ padding: '100px 0' }}
        />
    );
}