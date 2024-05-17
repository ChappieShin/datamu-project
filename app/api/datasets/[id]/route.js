import MySQL_DB from '@/utils/mysql-db';
import Mongo_DB from '@/utils/mongo-db';
import axios from 'axios';

export async function GET(request, { params }) {
    const query_dataset = `SELECT ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email, faculty_name, faculty_short, faculty_color, u.unit_id, dv.division_id,
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
                            WHERE ds.dataset_id = ${params.id}
                            GROUP BY ds.dataset_id, title, subtitle, description, created_date, modified_date, data_lang, permission_type, owner_id, fname, lname, email`;

    const query_table = `SELECT COUNT(table_id) AS 'num_tables' FROM DataTables WHERE dataset_id = ${params.id}`;

    if (!process.env.NEXT_PUBLIC_API_URL) {
        return;
    }
     
    try {
        const db = await MySQL_DB();
        const [results_dataset] = await db.query(query_dataset);
        const [results_table] = await db.query(query_table);

        let dataset = {};
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tables?dataset_id=${params.id}`);
            dataset = { ...results_dataset[0], ...results_table[0], tables: response.data.data };
        } catch (error) {
            console.error('Error getting table data', error);
            throw error;
        }
        db.release();

        return Response.json({ error: false, data: dataset });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function PUT(request, { params }) {
    const body = await request.json();
    const { title, subtitle, description, data_lang, permission_type, tag_ids, user_id } = body;
    const dataset = {
        title: title,
        subtitle: subtitle,
        description: description,
        data_lang: data_lang,
        permission_type: permission_type
    };

    const query_dataset = `UPDATE Datasets SET ? WHERE dataset_id = ${params.id}`;
    const query_delete_tag = `DELETE FROM Datasets_Tags WHERE dataset_id = ${params.id}`;
    const query_insert_tag = `INSERT INTO Datasets_Tags SET ?`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query_dataset, dataset);

        await db.query(query_delete_tag);

        if (tag_ids) {
            const promises_tag = tag_ids.map(async (tag_id) => {
                const body = { dataset_id: params.id, tag_id: tag_id };
                await db.query(query_insert_tag, body);
            });
            await Promise.all(promises_tag);
        }

        if (results.affectedRows === 0) {
            db.release();
            
            const log = { dataset_id: params.id, user_id: user_id, status: 'Failed', detail: `Edit dataset info: dataset does not exist` };
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);
            
            return Response.json({ error: true, message: `Unable to edit (dataset_id: ${params.id} does not exist)` });
        }
        db.release();

        const log = { dataset_id: params.id, user_id: user_id, status: 'Success', detail: 'Edit dataset info' };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);

        return Response.json({ error: false, message: 'Successfully edited dataset info' });
    } catch (error) {
        console.error('Error running query', error);

        const log = { dataset_id: params.id, user_id: user_id, status: 'Failed', detail: `Edit dataset info: ${error.message}` };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);

        return Response.json({ error: true, message: error.message });
    }
}

export async function DELETE(request, { params }) {
    const { searchParams } = new URL (request.url);
    const user_id = searchParams.get('user_id');
    
    const query_dataset = `DELETE FROM Datasets WHERE dataset_id = ${params.id}`;
    const query_table = `DELETE FROM DataTables WHERE dataset_id = ${params.id}`;
    const query_tag = `DELETE FROM Datasets_Tags WHERE dataset_id = ${params.id}`;
    const query_log = `DELETE FROM DatasetLogs WHERE dataset_id = ${params.id}`;
    const query_table_ids = `SELECT table_id FROM DataTables WHERE dataset_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        await db.query(query_tag);
        await db.query(query_log);
        
        const [results_table_ids] = await db.query(query_table_ids);
        const [results_table] = await db.query(query_table);
        const [results_dataset] = await db.query(query_dataset);

        if (results_table_ids.length === 0 || results_table.affectedRows === 0 || results_dataset.affectedRows === 0) {
            db.release();
            return Response.json({ error: true, message: `Unable to delete (dataset_id: ${params.id} does not exist)` });
        }

        const client = await Mongo_DB();
        const database = client.db(process.env.MONGO_DATABASE);

        await Promise.all(results_table_ids.map(async ({ table_id }) => {
            await database.collection(table_id.toString()).drop();
        }));
        
        db.release();
        await client.close();

        const log = { dataset_id: params.id, user_id: user_id, status: 'Success' };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=DELETE`, log);
        
        return Response.json({ error: false, message: `Successfully deleted a dataset (dataset_id: ${params.id})` });
    } catch (error) {
        console.error('Error running query', error);

        const log = { dataset_id: params.id, user_id: user_id, status: 'Failed', detail: error.message };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=DELETE`, log);

        return Response.json({ error: true, message: error.message });
    }
}