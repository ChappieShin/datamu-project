import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import MySQL_DB from '@/utils/mysql-db';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }

                const query = `SELECT user_id, password, role FROM Users u WHERE username = ?`;

                const db = await MySQL_DB();
                const [results] = await db.query(query, [credentials.username]);
                db.release();

                const user = results[0];

                if (!user) {
                    throw new Error('Invalid username');
                }

                if (!bcrypt.compareSync(credentials.password, user.password)) {
                    throw new Error('Invalid password');
                }

                return { name: user.user_id, email: user.role };
            }
        })
    ]
});

export { handler as GET, handler as POST }