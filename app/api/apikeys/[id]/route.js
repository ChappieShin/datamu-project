import MySQL_DB from '@/utils/mysql-db';

export async function GET(request, { params }) {
    const query = `SELECT key_id, api_key, generated_date, expired_date, u1.fname AS 'assigned_to_fname', u1.lname AS 'assigned_to_lname', u2.fname AS 'assigned_by_fname', u2.lname AS 'assigned_by_lname'
                    FROM APIKeys a JOIN Users u1 ON a.assigned_to = u1.user_id JOIN Users u2 ON a.assigned_by = u2.user_id
                    WHERE key_id = ${params.id}`;
                    
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

export async function PUT(request, { params }) {
    const body = await request.json();
    const query = `UPDATE APIKeys SET ? WHERE key_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, body);
        db.release();
        if (results.affectedRows === 0) {
            return Response.json({ error: true, message: `Unable to edit (key_id: ${params.id} does not exist)` });
        }
        return Response.json({ error: false, message: 'Successfully edited API key' });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function DELETE(request, { params }) {
    const query = `DELETE FROM APIKeys WHERE key_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query);
        db.release();
        if (results.affectedRows === 0) {
            return Response.json({ error: true, message: `Unable to delete (key_id: ${params.id} does not exist)` });
        }
        return Response.json({ error: false, message: `Successfully deleted an API key (key_id: ${params.id})` });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}