import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@datamu-cluster.uoalv6k.mongodb.net/?retryWrites=true&w=majority`;

export default async function Mongo_DB() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error('Error getting connection to MongoDB', error);
        throw error;
    }
}