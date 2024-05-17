import axios from 'axios';

import MySQL_DB from '@/utils/mysql-db';
import Mongo_DB from '@/utils/mongo-db';

export async function GET(request, { params }) {
    const query = `SELECT * FROM DataTables WHERE dataset_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query);

        const client = await Mongo_DB();
        const database = client.db(process.env.MONGO_DATABASE);
        const collection = database.collection(params.id);
        const documents = await collection.find({}, { projection: { _id: 0 } }).toArray();
        const collection_size = await collection.aggregate([
            { $group: {
                    _id: null,
                    totalSize: { $sum: { $cond: { if: { $eq: [{ $type: "$$ROOT" }, "object"] }, then: { $bsonSize: "$$ROOT" }, else: 0 } } }
                }
            },
            { $project: { _id: 0, totalSize: 1 } }
        ]).toArray();

        const table = { ...results[0], table_size: collection_size[0].totalSize, num_cols: Object.keys(documents[0]).length, num_rows: documents.length, data: documents };

        db.release();
        await client.close();

        return Response.json({ error: false, data: table });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function PUT(request, { params }) {
    const body = await request.json();
    const { table_name, description, file_name, file_format, data, dataset_id, user_id } = body;
    
    const table = !data ?
    {
        table_name: table_name,
        description: description
    } : 
    {
        table_name: table_name,
        description: description,
        file_name: file_name,
        file_format: file_format
    };

    const query_table = `UPDATE DataTables SET ? WHERE table_id = ${params.id}`;
    const query_dataset = `UPDATE Datasets SET modified_date = NOW() WHERE dataset_id = (SELECT dataset_id FROM DataTables WHERE table_id = ${params.id})`;

    try {
        const db = await MySQL_DB();

        if (table.table_name) {
            const [results_table] = await db.query(query_table, table);
            if (results_table.affectedRows === 0) {
                db.release();
                return Response.json({ error: true, message: `Unable to edit (table_id: ${params.id} does not exist)` });
            }
            
            await db.query(query_dataset);
            db.release();
        }

        if (data) {
            const client = await Mongo_DB();
            const database = client.db(process.env.MONGO_DATABASE);
            await database.collection(params.id).deleteMany();
            await database.collection(params.id).insertMany(data);
            await client.close();
        }

        const log = { dataset_id: dataset_id, user_id: user_id, status: 'Success', detail: 'Edit data table info' };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);

        return Response.json({ error: false, message: `Successfully edited a data table (table_id: ${params.id})` });
    } catch (error) {
        console.error('Error running query', error);

        const log = { dataset_id: dataset_id, user_id: user_id, status: 'Failed', detail: `Edit data table info ${error.message}` };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);

        return Response.json({ error: true, message: error.message });
    }
}

export async function DELETE(request, { params }) {
    const { searchParams } = new URL (request.url);
    const user_id = searchParams.get('user_id');
    const dataset_id = searchParams.get('dataset_id');

    const query_delete = `DELETE FROM DataTables WHERE table_id = ${params.id}`;
    const query_check = `SELECT * FROM DataTables WHERE dataset_id = (SELECT dataset_id FROM DataTables WHERE table_id = ${params.id})`;
    const query_update = `UPDATE Datasets SET modified_date = NOW() WHERE dataset_id = (SELECT dataset_id FROM DataTables WHERE table_id = ${params.id})`;

    try {
        const db = await MySQL_DB();
        
        const [results_check] = await db.query(query_check);
        if (results_check.length === 1) {
            db.release();
            return Response.json({ error: true, message: 'Unable to delete (Your dataset must have at least one data table)' });
        }

        const [results_delete] = await db.query(query_delete);
        if (results_delete.affectedRows === 0) {
            db.release();
            return Response.json({ error: true, message: `Unable to delete (table_id: ${params.id} does not exist)` });
        }

        await db.query(query_update);
        db.release();

        const client = await Mongo_DB();
        const database = client.db(process.env.MONGO_DATABASE);
        await database.collection(params.id).drop();
        await client.close();

        const log = { dataset_id: dataset_id, user_id: user_id, status: 'Success', detail: 'Delete data table' };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);

        return Response.json({ error: false, message: `Successfully deleted a data table (table_id: ${params.id})` });
    } catch (error) {
        console.error('Error running query', error);

        const log = { dataset_id: dataset_id, user_id: user_id, status: 'Failed', detail: `Delete data table: ${error.message}` };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?log_type=EDIT`, log);

        return Response.json({ error: true, message: error.message });
    }
}