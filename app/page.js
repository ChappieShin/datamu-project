'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import PageHeader from '@/components/home/header';
import PageContent from '@/components/home/content';

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