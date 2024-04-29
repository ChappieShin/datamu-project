import MySQL_DB from '@/utils/mysql-db';

export async function GET(request, { params }) {
    const { searchParams } = new URL (request.url);
    const log_type = searchParams.get('log_type');

    const query = log_type === 'VIEW' ? 
                   `SELECT DATE(log_date) AS 'view_date', COUNT(log_id) AS 'Number of view(s)'
                   FROM DatasetLogs
                   WHERE dataset_id = ? AND log_type = 'VIEW' AND status = 'Success'
                   GROUP BY view_date
                   ORDER BY view_date` :
                   log_type === 'EXPORT' ?
                    `SELECT detail AS 'export_format', DATE(log_date) AS 'export_date', COUNT(log_id) AS 'Number of export(s)'
                    FROM DatasetLogs
                    WHERE dataset_id = ? AND log_type = 'EXPORT' AND status = 'Success'
                    GROUP BY export_format, export_date
                    ORDER BY export_date` :
                    undefined;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, params.id);
        db.release();
        return Response.json({ error: false, data: results });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}