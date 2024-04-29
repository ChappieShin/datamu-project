import PageHeader from '@/components/view-user/header';
import PageContent from '@/components/view-user/content';

export default function ViewUser({ params }) {
    return (
        <>
            <PageHeader user_id={params.id} />
            <PageContent user_id={params.id} />
        </>
    );
}