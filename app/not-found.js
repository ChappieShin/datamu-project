import Link from 'next/link';
import { Result, Button } from 'antd';

export default function NotFound() {
    return (
        <Result 
            status='404'
            title='404 - Not Found'
            subTitle='Sorry, the page you visited does not exist.'
            extra={
                <Link href='/'>
                    <Button type='primary'>Back Home</Button>
                </Link>
            }
            style={{ padding: '100px 0' }}
        />
    );
}