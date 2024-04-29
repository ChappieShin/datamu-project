import MySQL_DB from '@/utils/mysql-db';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const id = searchParams.get('faculty_id');

    const query = id ? `SELECT unit_id, unit_name, unit_short FROM Units WHERE faculty_id = ${id}` : `SELECT * FROM Units`;

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