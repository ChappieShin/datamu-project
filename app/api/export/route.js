import axios from 'axios';
import MySQL_DB from '@/utils/mysql-db';
import Mongo_DB from '@/utils/mongo-db';

export async function GET(request) {
    const { searchParams } = new URL (request.url);

    const dataset_id = searchParams.get('dataset_id');
    const table_ids = searchParams.get('table_ids').split(',');
    const user_id = searchParams.get('user_id');
    const api_key = searchParams.get('api_key');

    const fetchLogExport = async (detail, status) => {
        try {
            const body = { dataset_id: dataset_id, user_id: user_id, detail: detail, status: status }
            await axios.post(`http://localhost:3000/api/logs?log_type=EXPORT`, body);
        } catch (error) {
            console.log('Error', error);
        }
    };

    if (!table_ids) {
        fetchLogExport('Export as API: Table ID(s) does not provide', 'Failed');
        return Response.json({ error: true, message: 'Table ID(s) does not provide' });
    }

    if (!api_key) {
        fetchLogExport('Export as API: API key does not provide', 'Failed');
        return Response.json({ error: true, message: 'API key does not provide' });
    }

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(`SELECT api_key, expired_date FROM APIKeys WHERE assigned_to = ${user_id}`);

        if (api_key !== results[0].api_key) {
            fetchLogExport('Export as API: Invalid API key', 'Failed');
            return Response.json({ error: true, message: 'Invalid API key' });  
        }
        if (new Date() > new Date(results[0].expired_date)) {
            fetchLogExport('Export as API: API key is already expired', 'Failed');
            return Response.json({ error: true, message: 'API key is already expired' });
        }

    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }

    try {
        const db = await MySQL_DB();
        const client = await Mongo_DB();

        const tables = [];
        const promises = table_ids.map(async (table_id) => {
            const [results] = await db.query(`SELECT table_name FROM DataTables WHERE table_id = ${table_id}`);
            const database = client.db(process.env.MONGO_DATABASE);
            const collection = database.collection(table_id);
            const documents = await collection.find({}, { projection: { _id: 0 } }).toArray();

            tables.push({ ...results[0], data: documents });
        });

        await Promise.all(promises);
        db.release();
        await client.close();

        fetchLogExport('API', 'Success');

        return Response.json({ error: false, data: tables });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}