import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

export default async function MySQL_DB() {
    try {
        const connection = await db.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting connection to MySQL', error);
        throw error;
    }
}