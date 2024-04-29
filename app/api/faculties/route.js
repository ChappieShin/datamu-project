import MySQL_DB from '@/utils/mysql-db';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const countDatasets = searchParams.get('count_datasets');

    const query = !countDatasets ? 
        `SELECT faculty_id, faculty_name, faculty_short FROM Faculties` :
        `SELECT f.faculty_id, faculty_name, faculty_short, faculty_color, COUNT(dataset_id) AS 'Number of dataset(s)' 
        FROM Datasets ds JOIN Users u ON ds.owner_id = u.user_id RIGHT JOIN Faculties f ON u.faculty_id = f.faculty_id
        GROUP BY f.faculty_id`;
    
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