import MySQL_DB from '@/utils/mysql-db';
import axios from 'axios';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const user_id = searchParams.get('user_id');
    const search_keyword = searchParams.get('search_keyword');

    let query_dataset;

    if (user_id && search_keyword) {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color, u.unit_id, dv.division_id,
                        GROUP_CONCAT(t.tag_name) AS tags, 
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id JOIN Units un ON u.unit_id = un.unit_id JOIN Divisions dv ON u.division_id = dv.division_id
                        LEFT JOIN Datasets_Tags dt ON ds.dataset_id = dt.dataset_id LEFT JOIN Tags t ON dt.tag_id = t.tag_id
                        LEFT JOIN (
                            SELECT dataset_id, 
                                   SUM(CASE WHEN log_type = 'VIEW' THEN 1 ELSE 0 END) AS view_count,
                                   SUM(CASE WHEN log_type = 'EXPORT' THEN 1 ELSE 0 END) AS export_count
                            FROM DatasetLogs
                            WHERE status = 'Success'
                            GROUP BY dataset_id
                        ) dl ON ds.dataset_id = dl.dataset_id
                        WHERE owner_id = ${user_id} AND LOWER(title) LIKE '%${search_keyword}%' OR LOWER(subtitle) LIKE '%${search_keyword}%'
                        GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;
    }
    else if (user_id) {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color, u.unit_id, dv.division_id,
                        GROUP_CONCAT(t.tag_name) AS tags,
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id JOIN Units un ON u.unit_id = un.unit_id JOIN Divisions dv ON u.division_id = dv.division_id
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
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color, u.unit_id, dv.division_id,
                        GROUP_CONCAT(t.tag_name) AS tags,
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id JOIN Units un ON u.unit_id = un.unit_id JOIN Divisions dv ON u.division_id = dv.division_id
                        LEFT JOIN Datasets_Tags dt ON ds.dataset_id = dt.dataset_id LEFT JOIN Tags t ON dt.tag_id = t.tag_id
                        LEFT JOIN (
                            SELECT dataset_id, 
                                   SUM(CASE WHEN log_type = 'VIEW' THEN 1 ELSE 0 END) AS view_count,
                                   SUM(CASE WHEN log_type = 'EXPORT' THEN 1 ELSE 0 END) AS export_count
                            FROM DatasetLogs
                            WHERE status = 'Success'
                            GROUP BY dataset_id
                        ) dl ON ds.dataset_id = dl.dataset_id
                        WHERE LOWER(title) LIKE '%${search_keyword}%' OR LOWER(subtitle) LIKE '%${search_keyword}%'
                        GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;
    }
    else {
        query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, u.faculty_id, faculty_name, faculty_short, faculty_color, u.unit_id, dv.division_id,
                        GROUP_CONCAT(t.tag_name) AS tags,
                        CAST(COALESCE(ANY_VALUE(view_count), 0) AS UNSIGNED) AS view_count,
                        CAST(COALESCE(ANY_VALUE(export_count), 0) AS UNSIGNED) AS export_count
                        FROM Datasets ds 
                        JOIN Users u ON ds.owner_id = u.user_id JOIN Faculties f ON u.faculty_id = f.faculty_id JOIN Units un ON u.unit_id = un.unit_id JOIN Divisions dv ON u.division_id = dv.division_id
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
        
        const log = { dataset_id: results.insertId, user_id: owner_id, status: 'Success' };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=CREATE`, log);
        
        return Response.json({ error: false, message: `Successfully created a new dataset (dataset_id: ${results.insertId})`, data: results });
    } catch (error) {
        console.error('Error running query', error);

        const log = { user_id: owner_id, status: 'Failed', detail: error.message };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=CREATE`, log);

        return Response.json({ error: true, message: error.message });
    }
}