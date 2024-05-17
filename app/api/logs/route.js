import MySQL_DB from '@/utils/mysql-db';

export async function GET(request) {
    const query = `SELECT log_id, log_date, detail, log_type, status, fname, lname, role, dataset_id
                    FROM DatasetLogs dl 
                    JOIN Users u ON dl.user_id = u.user_id`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query);
        db.release();
        return Response.json({ error: false, data: results });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function POST(request) {
    const body = await request.json();
    const { searchParams } = new URL (request.url);
    const log_type = searchParams.get('log_type');
    
    const query = `INSERT INTO DatasetLogs SET ?`;
    
    try {
        const db = await MySQL_DB();

        if (log_type) {
            await db.query(query, { ...body, log_type: log_type });
        }
        db.release();

        return Response.json({ error: false, message: `Successfully logged ${log_type} (log_id: ${results.insertId})` }); 
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}