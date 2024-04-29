import MySQL_DB from '@/utils/mysql-db';

export async function GET() {
    const query = `SELECT t.tag_id, tag_name, COUNT(dataset_id) AS 'Number of dataset(s)'
                   FROM Tags t LEFT JOIN Datasets_Tags dt ON t.tag_id = dt.tag_id
                   GROUP BY t.tag_id`;

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
    const query = `INSERT INTO Tags SET ?`;
    
    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, body);
        db.release();
        return Response.json({ error: false, message: `Successfully added a new tag (tag_id: ${results.insertId})` }); 
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}