import MySQL_DB from '@/utils/mysql-db';

export async function GET() {
    const query = `SELECT data_lang, COUNT(dataset_id) AS 'Number of dataset(s)'
                    FROM Datasets
                    GROUP BY data_lang`;

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