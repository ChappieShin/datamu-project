'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import PageHeader from '@/components/generate-apikey/header';
import PageContent from '@/components/generate-apikey/content';

export default function GenerateAPIKey() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [router, status]);

    return (
        <>
            <PageHeader />
            <PageContent user_id={session.user.name} />
        </>
    );
}