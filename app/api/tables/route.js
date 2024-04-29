import MySQL_DB from '@/utils/mysql-db';
import Mongo_DB from '@/utils/mongo-db';

export async function GET(request) {
    const { searchParams } = new URL (request.url);
    const id = searchParams.get('dataset_id');
    const query = !id ?
        `SELECT * FROM DataTables` :
        `SELECT * FROM DataTables WHERE dataset_id = ${id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query);

        const client = await Mongo_DB();
        const database = client.db(process.env.MONGO_DATABASE);

        const tables = [];
        const promises = results.map(async (table) => {
            const collection = database.collection(table.table_id.toString());
            const documents = await collection.find({}, { projection: { _id: 0 } }).toArray();
            const collection_size = await collection.aggregate([
                { $group: {
                        _id: null,
                        totalSize: { $sum: { $cond: { if: { $eq: [{ $type: "$$ROOT" }, "object"] }, then: { $bsonSize: "$$ROOT" }, else: 0 } } }
                    }
                },
                { $project: { _id: 0, totalSize: 1 } }
            ]).toArray();

            tables.push({ ...table, table_size: collection_size[0].totalSize, num_cols: Object.keys(documents[0]).length, num_rows: documents.length, data: documents });
        });

        await Promise.all(promises);
        db.release();
        await client.close();

        return Response.json({ error: false, data: tables });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function POST(request) {
    const body = await request.json();
    const { table_name, description, file_name, file_format, dataset_id, data } = body;
    const table = {
        table_name: table_name,
        description: description,
        file_name: file_name,
        file_format: file_format,
        dataset_id: dataset_id
    };
    const query = `INSERT INTO DataTables SET ?`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, table);

        const client = await Mongo_DB();
        const database = client.db(process.env.MONGO_DATABASE);
        const collection = database.collection(results.insertId.toString());
        await collection.insertMany(data);

        db.release();
        await client.close();

        return Response.json({ error: false, message: `Successfully added a new data table (table_id: ${results.insertId})` })
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}