import MySQL_DB from '@/utils/mysql-db';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const id = searchParams.get('unit_id');

    const query = id ? `SELECT division_id, division_name, division_short FROM Divisions WHERE unit_id = ${id}` : `SELECT * FROM Divisions`;

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