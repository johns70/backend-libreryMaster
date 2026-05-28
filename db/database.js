import mysql from 'promise-mysql'
import { configDotenv } from 'dotenv';
configDotenv();

export const connection = async () => {
    const pool = await mysql.createPool({
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    return pool;
};

