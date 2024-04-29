import MySQL_DB from '@/utils/mysql-db';

export async function GET(request, { params }) {
    const query = `SELECT user_id, username, password, fname, lname, email, role, fc.faculty_id, faculty_name, faculty_short, faculty_color, un.unit_id, unit_name, unit_short, dv.division_id, division_name, division_short
                    FROM Users u JOIN Faculties fc ON u.faculty_id = fc.faculty_id JOIN Units un ON u.unit_id = un.unit_id JOIN Divisions dv ON u.division_id = dv.division_id
                    WHERE user_id = ${params.id}`;
                    
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
    const query = `UPDATE Users SET ? WHERE user_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, body);
        db.release();
        if (results.affectedRows === 0) {
            return Response.json({ error: true, message: `Unable to edit (user_id: ${params.id} does not exist)` });
        }
        return Response.json({ error: false, message: 'Successfully edited user profile' });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function DELETE(request, { params }) {
    const query = `DELETE FROM Users WHERE user_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query);
        db.release();
        if (results.affectedRows === 0) {
            return Response.json({ error: true, message: `Unable to delete (user_id: ${params.id} does not exist)` });
        }
        return Response.json({ error: false, message: `Successfully deleted a user (user_id: ${params.id})` });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}