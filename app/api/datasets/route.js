import MySQL_DB from '@/utils/mysql-db';
import axios from 'axios';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const user_id = searchParams.get('user_id');
    const search_keyword = searchParams.get('search_keyword');
    const permission_type = searchParams.get('permission_type');
    const sort_option = searchParams.get('sort_option');
    const owner_id = searchParams.get('owner_id');
    const organizations = searchParams.get('organizations');
    const tags = searchParams.get('tags');
    const data_lang = searchParams.get('data_lang');

    let query_dataset;

    if (user_id && search_keyword) {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color,
                        GROUP_CONCAT(t.tag_name) AS tags, 
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id
                        LEFT JOIN Datasets_Tags dt ON ds.dataset_id = dt.dataset_id LEFT JOIN Tags t ON dt.tag_id = t.tag_id
                        LEFT JOIN (
                            SELECT dataset_id, 
                                   SUM(CASE WHEN log_type = 'VIEW' THEN 1 ELSE 0 END) AS view_count,
                                   SUM(CASE WHEN log_type = 'EXPORT' THEN 1 ELSE 0 END) AS export_count
                            FROM DatasetLogs
                            WHERE status = 'Success'
                            GROUP BY dataset_id
                        ) dl ON ds.dataset_id = dl.dataset_id
                        WHERE owner_id = ${user_id} AND title LIKE '%${search_keyword}%' OR subtitle LIKE '%${search_keyword}%'
                        GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;
    }
    else if (user_id) {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color,
                        GROUP_CONCAT(t.tag_name) AS tags,
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id
                        LEFT JOIN Datasets_Tags dt ON ds.dataset_id = dt.dataset_id LEFT JOIN Tags t ON dt.tag_id = t.tag_id
                        LEFT JOIN (
                            SELECT dataset_id, 
                                   SUM(CASE WHEN log_type = 'VIEW' THEN 1 ELSE 0 END) AS view_count,
                                   SUM(CASE WHEN log_type = 'EXPORT' THEN 1 ELSE 0 END) AS export_count
                            FROM DatasetLogs
                            WHERE status = 'Success'
                            GROUP BY dataset_id
                        ) dl ON ds.dataset_id = dl.dataset_id
                        WHERE owner_id = ${user_id}
                        GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;
    }
    else if (search_keyword) {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color,
                        GROUP_CONCAT(t.tag_name) AS tags,
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id
                        LEFT JOIN Datasets_Tags dt ON ds.dataset_id = dt.dataset_id LEFT JOIN Tags t ON dt.tag_id = t.tag_id
                        LEFT JOIN (
                            SELECT dataset_id, 
                                   SUM(CASE WHEN log_type = 'VIEW' THEN 1 ELSE 0 END) AS view_count,
                                   SUM(CASE WHEN log_type = 'EXPORT' THEN 1 ELSE 0 END) AS export_count
                            FROM DatasetLogs
                            WHERE status = 'Success'
                            GROUP BY dataset_id
                        ) dl ON ds.dataset_id = dl.dataset_id
                        WHERE title LIKE '%${search_keyword}%' OR subtitle LIKE '%${search_keyword}%'
                        GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;
    }
    else {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color,
                        GROUP_CONCAT(t.tag_name) AS tags,
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id
                        LEFT JOIN Datasets_Tags dt ON ds.dataset_id = dt.dataset_id LEFT JOIN Tags t ON dt.tag_id = t.tag_id
                        LEFT JOIN (
                            SELECT dataset_id, 
                                   SUM(CASE WHEN log_type = 'VIEW' THEN 1 ELSE 0 END) AS view_count,
                                   SUM(CASE WHEN log_type = 'EXPORT' THEN 1 ELSE 0 END) AS export_count
                            FROM DatasetLogs
                            WHERE status = 'Success'
                            GROUP BY dataset_id
                        ) dl ON ds.dataset_id = dl.dataset_id
                        GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;
    }
        
    const query_table = `SELECT COUNT(table_id) AS 'num_tables' FROM DataTables WHERE dataset_id = ?`;

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }

    try {
        const db = await MySQL_DB();
        const [results_dataset] = await db.query(query_dataset);
        
        let datasets = [];
        const promises = results_dataset.map(async (dataset) => {
            const [result_table] = await db.query(query_table, [dataset.dataset_id]);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tables?dataset_id=${dataset.dataset_id}`);
            datasets.push({ ...dataset, ...result_table[0], tables: response.data.data });
        });

        await Promise.all(promises);
        db.release();

        if (permission_type && permission_type !== 'all') {
            if (permission_type === 'owned') {
                datasets = datasets.filter((dataset) => (dataset.owner_id === Number(owner_id)));
            }
            else if (permission_type === 'shared') {
                datasets = datasets.filter((dataset) => (dataset.owner_id !== Number(owner_id)));
            }
        }

        if (organizations) {
            datasets = datasets.filter((dataset) => (organizations.split(',').includes(dataset.faculty_id.toString())));
        }

        if (tags) {
            const tagList = tags.split(',');
            datasets = datasets.filter((dataset) =>
                dataset.tags.split(',').some(tag => tagList.includes(tag))
            );
        }

        if (data_lang) {
            datasets = datasets.filter((dataset) => (data_lang.split(',').includes(dataset.data_lang)))
        }

        if (sort_option && sort_option !== 'none') {
            if (sort_option === 'name_asc') {
                datasets.sort((a, b) => (a.title.localeCompare(b.title)));
            }
            else if (sort_option === 'name_desc') {
                datasets.sort((a, b) => (b.title.localeCompare(a.title)));
            }
            else if (sort_option === 'modified_asc') {
                datasets.sort((a, b) => (new Date(a.modified_date) - new Date(b.modified_date)));
            }
            else if (sort_option === 'modified_desc') {
                datasets.sort((a, b) => (new Date(b.modified_date) - new Date(a.modified_date)));
            }
            else if (sort_option === 'most_viewed') {
                datasets.sort((a, b) => (b.view_count - a.view_count));
            }
            else if (sort_option === 'most_exported') {
                datasets.sort((a, b) => (b.export_count - a.export_count));
            }
        }

        return Response.json({ error: false, data: datasets });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function POST(request) {
    const body = await request.json();
    const { title, subtitle, description, data_lang, permission_type, owner_id, tag_ids, tables } = body;
    const dataset = {
        title: title,
        subtitle: subtitle,
        description: description,
        data_lang: data_lang,
        permission_type: permission_type,
        owner_id: owner_id
    };

    const query_dataset = `INSERT INTO Datasets SET ?`;
    const query_tag = `INSERT INTO Datasets_Tags SET ?`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query_dataset, dataset);
        
        if (tag_ids) {
            const promises_tag = tag_ids.map(async (tag_id) => {
                const body = { dataset_id: results.insertId, tag_id: tag_id };
                await db.query(query_tag, body);
            });
            await Promise.all(promises_tag);
        }
        
        const promises_table = tables.map(async (table) => {
            const body = { ...table, dataset_id: results.insertId };
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tables`, body);
            } catch (error) {
                console.error('Error inserting table data', error);
                throw error;
            }
        });
        await Promise.all(promises_table);

        db.release();

        return Response.json({ error: false, message: `Successfully created a new dataset (dataset_id: ${results.insertId})`, data: results });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}