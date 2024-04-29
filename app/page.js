'use client'

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// import PageHeader from '@/components/home/header';
// import PageContent from '@/components/home/content';

const PageHeader = dynamic(() => (import('@/components/home/header')), { ssr: false });
const PageContent = dynamic(() => (import('@/components/home/content')), { ssr: false });

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [router, status]);

    return ( status === 'authenticated' &&
        <>
            <PageHeader user_id={session.user.name} />
            <PageContent />
        </>
    );
}