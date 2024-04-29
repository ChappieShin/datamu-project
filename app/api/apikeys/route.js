import MySQL_DB from '@/utils/mysql-db';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const user_id = searchParams.get('user_id');

    const query = user_id ? 
                `SELECT key_id, api_key, generated_date, expired_date, u1.fname AS 'assigned_to_fname', u1.lname AS 'assigned_to_lname', u2.fname AS 'assigned_by_fname', u2.lname AS 'assigned_by_lname'
                FROM APIKeys a JOIN Users u1 ON a.assigned_to = u1.user_id JOIN Users u2 ON a.assigned_by = u2.user_id
                WHERE assigned_to = ${user_id}` :
                `SELECT key_id, api_key, generated_date, expired_date, u1.fname AS 'assigned_to_fname', u1.lname AS 'assigned_to_lname', u2.fname AS 'assigned_by_fname', u2.lname AS 'assigned_by_lname'
                FROM APIKeys a JOIN Users u1 ON a.assigned_to = u1.user_id JOIN Users u2 ON a.assigned_by = u2.user_id`;

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
    const query = `INSERT INTO APIKeys SET ?`;
    
    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, body);
        db.release();
        return Response.json({ error: false, message: `Successfully generated a new API key (key_id: ${results.insertId})` }); 
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}