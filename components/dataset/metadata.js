import { Card, Descriptions } from 'antd';
import { filesize } from 'filesize';

export default function Metadata({ dataset }) {
    const metadata_items = [
        {
            label: 'Dataset ID',
            key: 'dataset_id',
            children: dataset.dataset_id,
            span: 3
        },
        {
            label: 'Number of Tables',
            key: 'num_tables',
            children: dataset.num_tables,
            span: 2
        },
        {
            label: 'Total Size',
            key: 'total_size',
            children: filesize(dataset.total_size),
            span: 2
        },
        {
            label: 'Created Date',
            key: 'created_date',
            children: new Date(dataset.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
            span: 2
        },
        {
            label: 'Last Modified Date',
            key: 'modified_date',
            children: new Date(dataset.modified_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
            span: 2
        },
        {
            label: 'Owner',
            key: 'owner',
            children: `${dataset.fname + ' ' + dataset.lname} (${dataset.email})`,
            span: 3
        },
        {
            label: 'Organization',
            key: 'organization',
            children: (`${dataset.faculty_short} (${dataset.faculty_name})`),
            span: 3
        },
        {
            label: 'Permission',
            key: 'permission_type',
            children: dataset.permission_type,
            span: 3
        },
        {
            label: 'Data Format',
            key: 'data_format',
            children: [...new Set(dataset.tables.map((table) => (table.file_format)))].map((item) => (item === 'csv' ? `CSV (.${item})` : `Excel (.${item})`)).join(', '),
            span: 2
        },
        {
            label: 'Data Language',
            key: 'data_lang',
            children: dataset.data_lang,
            span: 2
        },
        {
            label: 'Tags',
            key: 'tags',
            children: (
                <ul>
                    {dataset.tags && dataset.tags.split(',').map((tag) => (
                        <li>{tag}</li>
                    ))}
                </ul>
            )
        }
    ];

    return (
        <Card title='Metadata'>
            <Descriptions bordered items={metadata_items} />
        </Card>
    );
}