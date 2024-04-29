import MySQL_DB from '@/utils/mysql-db';

export async function GET(request, { params }) {
    const query = `SELECT tag_id, tag_name FROM Tags WHERE tag_id = ${params.id}`;

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
    const query = `UPDATE Tags SET ? WHERE tag_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results] = await db.query(query, body);
        db.release();
        if (results.affectedRows === 0) {
            return Response.json({ error: true, message: `Unable to edit (tag_id: ${params.id} does not exist)` });
        }
        return Response.json({ error: false, message: 'Successfully edited a tag' });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}

export async function DELETE(request, { params }) {
    const query_dataset = `DELETE FROM Datasets_Tags WHERE tag_id = ${params.id}`;
    const query_tag = `DELETE FROM Tags WHERE tag_id = ${params.id}`;

    try {
        const db = await MySQL_DB();
        const [results_dataset] = await db.query(query_dataset);
        const [results_tag] = await db.query(query_tag);
        db.release();
        if (results_tag.affectedRows === 0) {
            return Response.json({ error: true, message: `Unable to delete (tag_id: ${params.id} does not exist)` });
        }
        return Response.json({ error: false, message: `Successfully deleted a tag (tag_id: ${params.id})` });
    } catch (error) {
        console.error('Error running query', error);
        return Response.json({ error: true, message: error.message });
    }
}