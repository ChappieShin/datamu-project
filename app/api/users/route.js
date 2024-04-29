import MySQL_DB from '@/utils/mysql-db';
import bcrypt from 'bcrypt';

export async function GET() {
    const query = `SELECT user_id, username, fname, lname, email, role, fc.faculty_id, faculty_name, faculty_short, faculty_color, un.unit_id, unit_name, unit_short, dv.division_id, division_name, division_short
                    FROM Users u JOIN Faculties fc ON u.faculty_id = fc.faculty_id JOIN Units un ON u.unit_id = un.unit_id JOIN Divisions dv ON u.division_id = dv.division_id`;

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
    body.password = bcrypt.hashSync(body.password, 10);
    const query = `INSERT INTO Users SET ?`;
    
    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, body);
        db.release();
        return Response.json({ error: false, message: `Successfully added a new user (user_id: ${results.insertId})` }); 
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}