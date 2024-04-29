import mysql from 'mysql2/promise';

const uri = `mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}?ssl={"rejectUnauthorized":true}`;

const db = mysql.createPool(uri);

export default async function MySQL_DB() {
    try {
        const connection = await db.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting connection to MySQL', error);
        throw error;
    }
}