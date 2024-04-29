'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import PageHeader from '@/components/edit-profile/header';
import PageContent from '@/components/edit-profile/content';

export default function EditProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [router, status]);

    return ( status === 'authenticated' &&
        <>
            <PageHeader />
            <PageContent user_id={session.user.name} />
        </>
    );
}